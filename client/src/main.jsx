import React from 'react'
import ReactDOM from 'react-dom/client'
import ChatWidget from './components/ChatWidget'
import './index.css'

// Create a root element for the chatbot
const chatbotRootId = 'vet-chatbot-root';
let chatbotRoot = document.getElementById(chatbotRootId);

if (!chatbotRoot) {
  chatbotRoot = document.createElement('div');
  chatbotRoot.id = chatbotRootId;
  document.body.appendChild(chatbotRoot);
}

// Get config from window
const config = window.VetChatbotConfig || {};

ReactDOM.createRoot(chatbotRoot).render(
  <React.StrictMode>
    <ChatWidget config={config} />
  </React.StrictMode>,
)
