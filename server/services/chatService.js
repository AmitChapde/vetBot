const { GoogleGenerativeAI } = require("@google/generative-ai");
const Session = require('../models/Session');
const Appointment = require('../models/Appointment');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const VET_SYSTEM_PROMPT = `
You are a helpful veterinary assistant chatbot. 
Your goal is to answer generic veterinary questions about pet care, vaccination, diet, and common illnesses.
IMPORTANT:
1. If the user asks a question NOT related to veterinary/pets, politely decline to answer.
2. Do NOT provide medical diagnoses or prescriptions. Always advise seeing a vet for serious issues.
3. Keep answers concise and helpful.
`;

const handleChat = async (sessionId, userMessage) => {
  let session = await Session.findOne({ sessionId });
  
  if (!session) {
    session = new Session({ sessionId });
  }

  // Save user message
  session.messages.push({ sender: 'user', text: userMessage });
  
  let botResponse = "";
  
  // State Machine for Appointment Booking
  if (session.bookingState !== 'IDLE') {
    botResponse = await handleBookingFlow(session, userMessage);
  } else {
    // Check for appointment intent in IDLE state
    const intent = await checkIntent(userMessage);
    if (intent === 'BOOK_APPOINTMENT') {
      session.bookingState = 'ASKING_NAME';
      botResponse = "I can help you obtain an appointment. First, what is your name?";
    } else {
      // General Q&A
      botResponse = await generateAIResponse(session, userMessage);
    }
  }

  // Save bot message
  session.messages.push({ sender: 'bot', text: botResponse });
  await session.save();

  return { response: botResponse, sessionId };
};

const checkIntent = async (message) => {
  const lower = message.toLowerCase();
  if (lower.includes('appointment') || lower.includes('booking') || lower.includes('schedule') || lower.includes('visit vet')) {
    return 'BOOK_APPOINTMENT';
  }
  return 'GENERAL_QUERY';
};

const handleBookingFlow = async (session, message) => {
  switch (session.bookingState) {
    case 'ASKING_NAME':
      session.bookingData.ownerName = message;
      session.bookingState = 'ASKING_PET';
      return "Thanks! What is your pet's name?";
      
    case 'ASKING_PET':
      session.bookingData.petName = message;
      session.bookingState = 'ASKING_PHONE';
      return "Got it. What is your phone number?";
      
    case 'ASKING_PHONE':
      session.bookingData.phoneNumber = message;
      session.bookingState = 'ASKING_DATE';
      return "And when would you like to come in? (e.g., Tomorrow at 10 AM)";
      
    case 'ASKING_DATE':
      try {
        const parsedDate = await parseDateWithAI(message);
        if (!parsedDate) {
          return "I couldn't understand that date. Please try saying it differently (e.g., 'Tomorrow at 4 PM').";
        }
        session.bookingData.date = parsedDate; // Store as ISO string
        session.bookingState = 'CONFIRMING';
        return `Please confirm: Appointment for ${session.bookingData.petName} (${session.bookingData.ownerName}) on ${new Date(parsedDate).toLocaleString()} at contact ${session.bookingData.phoneNumber}. (Yes/No)`;
      } catch (err) {
        console.error("Date Parsing Error:", err);
        return "I'm having trouble with my calendar. Could you please repeat the date and time?";
      }
      
    case 'CONFIRMING':
      if (message.toLowerCase().includes('yes')) {
        // Create Appointment
        await Appointment.create({
          sessionId: session.sessionId,
          ownerName: session.bookingData.ownerName,
          petName: session.bookingData.petName,
          phoneNumber: session.bookingData.phoneNumber,
          date: new Date(session.bookingData.date), // Convert string back to Date object
          status: 'confirmed'
        });
        
        session.bookingState = 'IDLE';
        session.bookingData = {}; // Clear data
        return "Appointment confirmed! We look forward to seeing you.";
      } else {
        session.bookingState = 'IDLE';
        session.bookingData = {};
        return "Appointment booking cancelled. How else can I help?";
      }
      
    default:
      session.bookingState = 'IDLE';
      return "Something went wrong. Let's start over.";
  }
};

const parseDateWithAI = async (userDateText) => {
  try {
    const currentISO = new Date().toISOString();
    const prompt = `Current Time: ${currentISO}. 
    User Input: "${userDateText}". 
    Task: Convert the User Input into a valid ISO 8601 Date string (YYYY-MM-DDTHH:mm:ss.sssZ) relative to the Current Time. 
    If the user input is vague (e.g. "tomorrow"), assume 9:00 AM. 
    Return ONLY the ISO string.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Basic validation
    if (new Date(text).toString() === 'Invalid Date') return null;
    return text;
  } catch (error) {
    console.error("Gemini Date Parse Error:", error);
    return null;
  }
};

const generateAIResponse = async (session, userMessage) => {
  try {
    const history = session.messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })).slice(-10); // Keep last 10 context

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: VET_SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I will act as a veterinary assistant." }] },
        ...history
      ]
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again later.";
  }
};

module.exports = { handleChat };
