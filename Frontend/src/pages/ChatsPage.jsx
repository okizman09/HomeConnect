import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils';
import io from 'socket.io-client';

const ChatsPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketURL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    // Join user's room
    socketRef.current.emit('join', user?.id);

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (incomingMessage) => {
      if (
        selectedChat &&
        (incomingMessage.senderId === selectedChat.userId ||
          incomingMessage.receiverId === selectedChat.userId)
      ) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    });

    socketRef.current.on('userTyping', (data) => {
      // Handle typing indicator here
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?.id, selectedChat]);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await messagesAPI.getConversations();
        setConversations(data || []);
      } catch (err) {
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const data = await messagesAPI.getMessages(selectedChat.userId);
        setMessages(data || []);
      } catch (err) {
        setError('Failed to load messages');
      }
    };

    fetchMessages();
  }, [selectedChat]);

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

      // Also save via API
      await messagesAPI.sendMessage(selectedChat.userId, message.trim());

      setMessage('');
    } catch (err) {
      setError('Failed to send message');
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversation List */}
            <div className="w-1/3 border-r overflow-y-auto bg-gray-50">
              {loading ? (
                <div className="p-4 text-center text-gray-600">Loading...</div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => (
                  <div
                    key={conv._id || conv.userId}
                    onClick={() => setSelectedChat(conv)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${
                      selectedChat?.userId === conv.userId ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {(conv.userName || 'U')[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold text-gray-900">
                            {conv.userName || 'Unknown'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conv.lastTimestamp &&
                              formatTime(conv.lastTimestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unread > 0 && (
                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-600">
                  No conversations yet
                </div>
              )}
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                          {(selectedChat.userName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {selectedChat.userName || 'User'}
                          </h3>
                          <p className="text-xs text-gray-500">Active now</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`flex ${
                              msg.senderId === user.id
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div className="max-w-xs">
                              <div
                                className={`px-4 py-2 rounded-lg ${
                                  msg.senderId === user.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                                {msg.message}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 px-2">
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          No messages yet. Start the conversation!
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleSendMessage()
                        }
                        onFocus={() => handleTyping(true)}
                        onBlur={() => handleTyping(false)}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
