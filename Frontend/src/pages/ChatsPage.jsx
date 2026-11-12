import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, X, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils';
import io from 'socket.io-client';

// The backend populates sender/receiver refs ({ _id, name }) on some paths and
// leaves plain ids on others, so normalize before every comparison.
const idOf = (ref) => {
  if (ref === null || ref === undefined) return '';
  const raw = typeof ref === 'object' ? ref._id : ref;
  return String(raw || '');
};

const sameId = (a, b) => idOf(a) !== '' && idOf(a) === idOf(b);

const ChatsPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  // Mirror of selectedChat for socket handlers, so the connection (created once
  // per user below) never captures a stale chat or reconnects on every switch.
  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await messagesAPI.getConversations();
      setConversations(data?.conversations || data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  }, []);

  // Append a live message unless it is already in state (REST + socket overlap).
  const appendMessage = useCallback((incoming) => {
    setMessages((prev) =>
      prev.some((m) => String(m._id) === String(incoming._id)) ? prev : [...prev, incoming]
    );
  }, []);

  // Initialize Socket.io connection once per user. Never reconnect when the
  // selected chat changes: handlers read the live chat from selectedChatRef.
  useEffect(() => {
    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketURL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    // Join user's room
    socketRef.current.emit('join', user?.id);

    // Track who is online for presence indicators
    socketRef.current.on('onlineUsers', (userIds) => {
      setOnlineUsers(userIds || []);
    });

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (incomingMessage) => {
      const current = selectedChatRef.current;
      // If we are currently chatting with the sender, add the message
      if (
        current &&
        (sameId(incomingMessage.senderId, current.userId) ||
          sameId(incomingMessage.receiverId, current.userId))
      ) {
        appendMessage(incomingMessage);

        // If the window is open, mark as read immediately
        if (sameId(incomingMessage.senderId, current.userId)) {
          messagesAPI.markAsRead(idOf(current.userId)).catch(console.error);
        }
      } else {
        // Another conversation (or none) is open: refresh the list so the
        // last message and unread badge stay correct without a page reload.
        fetchConversations();
      }
    });

    // Listen for message confirmation (sent by current user)
    socketRef.current.on('messageSent', ({ chat }) => {
      const current = selectedChatRef.current;
      if (current && sameId(chat.receiverId, current.userId)) {
        appendMessage(chat);
      }
    });

    // Listen for read receipts
    socketRef.current.on('messagesRead', ({ receiverId }) => {
      const current = selectedChatRef.current;
      if (current && sameId(current.userId, receiverId)) {
        setMessages(prev => prev.map(msg =>
          sameId(msg.senderId, user?.id) ? { ...msg, read: true } : msg
        ));
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?.id, appendMessage, fetchConversations]);

  // Fetch conversations on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };

    load();
  }, [fetchConversations]);

  // Fetch messages when chat is selected. Live messages may arrive while the
  // request is in flight, so merge them in instead of replacing state, and
  // ignore the response if the user has already switched to another chat.
  useEffect(() => {
    if (!selectedChat) return;
    const chatUserId = idOf(selectedChat.userId);
    const myId = idOf(user?.id);
    let cancelled = false;

    const fetchMessages = async () => {
      try {
        setError('');
        const data = await messagesAPI.getMessages(chatUserId);
        if (cancelled || !sameId(selectedChatRef.current?.userId, chatUserId)) return;
        const fetched = data?.messages || [];

        setMessages((prev) => {
          const ids = new Set(fetched.map((m) => String(m._id)));
          const extras = prev.filter((m) =>
            !ids.has(String(m._id)) &&
            ((sameId(m.senderId, myId) && sameId(m.receiverId, chatUserId)) ||
              (sameId(m.senderId, chatUserId) && sameId(m.receiverId, myId)))
          );
          return [...fetched, ...extras];
        });

        // Mark as read immediately
        await messagesAPI.markAsRead(chatUserId);

        // Update local conversation unread count
        if (!cancelled) {
          setConversations(prev => prev.map(c =>
            sameId(c.userId, chatUserId) ? { ...c, unread: 0 } : c
          ));
        }

      } catch (err) {
        if (!cancelled) {
          setError('Failed to load messages');
          console.error('Error fetching messages:', err);
        }
      }
    };

    fetchMessages();
    return () => { cancelled = true; };
  }, [selectedChat, user?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      // Emit via socket for real-time update
      socketRef.current?.emit('sendMessage', {
        senderId: user.id,
        receiverId: selectedChat.userId,
        message: message.trim(),
      });

      setMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleTyping = (isTyping) => {
    if (selectedChat) {
      socketRef.current?.emit('typing', {
        senderId: user.id,
        receiverId: selectedChat.userId,
        isTyping,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8 h-[calc(100vh-80px)]">
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col md:flex-row">
          {/* Conversation List */}
          <div
            className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${selectedChat ? 'hidden md:flex' : 'flex'
              }`}
          >
            {/* Header */}
            <div className="p-4 border-b bg-white flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Messages</h2>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {loading ? (
                <div className="p-4 text-center text-gray-600">Loading conversations...</div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv._id || conv.userId}
                    onClick={() => setSelectedChat(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${sameId(selectedChat?.userId, conv.userId) ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {(conv.userName || 'U')[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conv.userName || 'Unknown'}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {conv.lastTimestamp && formatTime(conv.lastTimestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unread > 0 && (
                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-600">
                  No conversations yet. Start messaging landlords!
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedChat ? 'flex' : 'hidden md:flex'
              }`}
          >
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white flex-shrink-0 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {(selectedChat.userName || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {selectedChat.userName || 'User'}
                      </h3>
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${onlineUsers.some((id) => sameId(id, selectedChat.userId)) ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        <p className="text-xs text-gray-500">
                          {onlineUsers.some((id) => sameId(id, selectedChat.userId)) ? 'Active now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-0">
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
                      {error}
                    </div>
                  )}

                  <div className="space-y-3">
                    {messages.length > 0 ? (
                      messages.map((msg) => {
                        // Handle both populated objects and plain IDs
                        const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
                        const isCurrentUser = senderId === user.id || senderId === user._id || String(senderId) === String(user.id);

                        return (
                          <div
                            key={msg._id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className="max-w-xs md:max-w-md">
                              <div
                                className={`px-4 py-2 rounded-lg text-sm md:text-base ${isCurrentUser
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                                  }`}
                              >
                                {msg.message}
                              </div>
                              <div className="flex items-center justify-end space-x-1 mt-1 px-1">
                                <span className="text-[10px] text-gray-500">
                                  {formatTime(msg.timestamp)}
                                </span>
                                {isCurrentUser && (
                                  msg.read ? (
                                    <CheckCheck className="w-3 h-3 text-red-500" />
                                  ) : (
                                    <Check className="w-3 h-3 text-gray-400" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white flex-shrink-0">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      onFocus={() => handleTyping(true)}
                      onBlur={() => handleTyping(false)}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
