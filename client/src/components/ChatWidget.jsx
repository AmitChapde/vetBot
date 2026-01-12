import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendMessageToBackend } from '../api';

const ChatWidget = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate or retrieve session ID
    let currentSessionId = localStorage.getItem('vetSessionId');
    if (!currentSessionId) {
      currentSessionId = 'sess_' + Date.now();
      localStorage.setItem('vetSessionId', currentSessionId);
    }
    setSessionId(currentSessionId);

    // Initial greeting
    setMessages([
      { sender: 'bot', text: 'Hello! I am your veterinary assistant. Using AI, I can answer general questions about pet care or help you book an appointment.' }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const data = await sendMessageToBackend(userMessage, sessionId);
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vet-chat-widget">
      {/* Floating Button */}
      {!isOpen && (
        <button 
          className="vet-chat-toggle"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
          <span>Chat with us</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="vet-chat-window">
          <div className="vet-chat-header">
            <h3>Vet Assistant</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="vet-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`vet-chat-message ${msg.sender}`}>
                <div className="vet-chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="vet-chat-message bot">
                <div className="vet-chat-bubble loading">
                  <Loader2 className="animate-spin" size={16} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="vet-chat-input-area">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
