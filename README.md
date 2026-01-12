# Veterinary Chatbot SDK

A plug-and-play chatbot SDK for veterinary clinics, powered by Google Gemini AI.

## Features
- **Easy Integration**: Embed via a single script tag.
- **AI Q&A**: Answers generic veterinary questions using Gemini.
- **Appointment Booking**: Conversational flow to book appointments.
- **Persistence**: Stores sessions and appointments in MongoDB.

## Project Structure
- `client/`: React-based chatbot UI and SDK loader.
- `server/`: Node.js/Express backend with MongoDB and Gemini integration.

## Setup

### Prerequisites
- Node.js
- MongoDB
- Google Gemini API Key

### Backend
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` in the `server` directory (or root) and fill in your keys.
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vet-chatbot
   GEMINI_API_KEY=your_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend (Client/SDK)
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```
   This will start the Vite dev server at `http://localhost:5173`.

4. Build for embedding:
   ```bash
   npm run build
   ```
   The output files will be in `dist/`.

## Embedding the Chatbot
Add the following to your HTML file (adjust paths to where you host the built files):

```html
<link rel="stylesheet" href="/path/to/dist/assets/index.css">
<script type="module" src="/path/to/dist/assets/index.js"></script>

<!-- Optional Configuration -->
<script>
  window.VetChatbotConfig = {
    userId: "user_123",
    userName: "Alice",
    petName: "Bella",
    source: "website"
  };
</script>
```

## Troubleshooting
- **Disk Space Error**: If you encounter `ENOSPC` during `npm install`, ensure you have sufficient disk space.
- **API Key**: Ensure `GEMINI_API_KEY` is valid.
# vetBot
