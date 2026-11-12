import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { aiAPI } from '../services/api';

const AIChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am your AI Property Assistant. Ask me about policies, maintenance, or your lease.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            const response = await aiAPI.chat(userMessage);
            if (response.success && response.data.response) {
                setMessages(prev => [...prev, { role: 'assistant', text: response.data.response }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I couldn't process that. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: error.message || "Network error. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    // Function to format the message text (Basic Markdown Parser)
    const formatMessage = (text) => {
        return text.split('\n').map((line, i) => {
            // Handle lists
            if (line.trim().startsWith('* ')) {
                const content = line.trim().substring(2);
                return (
                    <div key={i} className="flex items-start mb-1">
                        <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-current rounded-full flex-shrink-0"></span>
                        <span dangerouslySetInnerHTML={{ __html: parseBold(content) }} />
                    </div>
                );
            }
            // Handle regular lines with bolding
            return (
                <div key={i} className={`min-h-[1.5em] ${line.trim() === '' ? 'h-2' : 'mb-1'}`}
                    dangerouslySetInnerHTML={{ __html: parseBold(line) }}
                />
            );
        });
    };

    // Helper to parse **bold** text
    const parseBold = (text) => {
        // Escape HTML first to prevent XSS (basic)
        let safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // Replace **text** with <strong>text</strong>
        return safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="glass-card rounded-lg w-80 md:w-96 h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 shadow-2xl border border-indigo-100">
                    {/* Header */}
                    <div className="bg-primary/95 backdrop-blur-md text-white p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-bold">HomeConnect AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-br-sm'
                                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                    }`}>
                                    {formatMessage(msg.text)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg p-3 rounded-bl-none shadow-sm flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110 flex items-center justify-center group"
                >
                    <MessageSquare className="w-6 h-6 group-hover:hidden" />
                    <Bot className="w-6 h-6 hidden group-hover:block" />
                </button>
            )}
        </div>
    );
};

export default AIChatAssistant;
