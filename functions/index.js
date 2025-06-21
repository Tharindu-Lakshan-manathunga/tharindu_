// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const functions = require("firebase-functions");
// The Firebase Admin SDK to access Firestore (not needed here, so commented out).
// const admin = require("firebase-admin");
// admin.initializeApp();

// Import the Google Generative AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// IMPORTANT: Load your Gemini API key securely from Firebase environment configuration.
// Set this using: firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY_HERE"
// Then deploy your functions with: firebase deploy --only functions
const GEMINI_API_KEY = functions.config().gemini?.apikey;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in Firebase functions config.");
  // For production, you might want to throw an error or handle this case properly.
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the knowledge base for the AI assistant
const tharinduKnowledgeText = `
Tharindu Lakshan is a System Support Engineer and a Computer Systems & Network Engineering Undergraduate from SLIIT.
His key professional experience includes:
- System Support Engineer at Epic Lanka Pvt Ltd (Apr 2024 – Present): Contributes to maintaining and enhancing production environments, working on mission-critical systems, managing Linux/Windows servers, containerizing applications with Docker, maintaining MySQL/PostgreSQL/MongoDB databases, automating monitoring, and resolving real-time issues.
- DevOps Intern at TechWave Innovations (Jan 2024 – Mar 2024): Contributed to DevOps pipeline automation, server configuration, built CI/CD pipelines (Jenkins, GitHub Actions), deployed VPS server for Java REST/Flutter Web apps, assisted Docker workflows.

Tharindu's key skills include:
- Cloud Platforms: AWS, Azure, OCI
- DevOps Tools: Docker, Jenkins, Ansible, Git
- Operating Systems: Linux (Ubuntu, CentOS, RHEL), Windows Server
- Monitoring: Grafana, Prometheus, Netdata
- Databases: MySQL, PostgreSQL, MongoDB, Oracle, Percona Extradb Cluster
- Security & Networking: Samba AD, ProxySQL, Load Balancing, HAProxy
- Programming & Scripting: Bash, Python, SQL, C

Tharindu's notable projects include:
- NFV Demonstration with Socket Programming in C
- Samba Active Directory Deployment
- Oracle 12c Cloud-Based DB Setup
- Monitoring of Microservices, Application Servers, and Databases
- Multi-Tier Environment for DOXMATE
- DevOps CI/CD Pipeline Automation
- Mission-Critical Gov System Support
- High Availability with ProxySQL
- CI/CD for Microservices
- Aqua Sync-Tech Smart Water Meter Billing and Monitoring with Mobile Application
- Final Year Research Project - AgrySense360

You can contact Tharindu Lakshan via:
- Email: tharindulakshan.dev@gmail.com
- Phone: +94 71 889 0601
- Location: Galle, Sri Lanka
- GitHub: https://github.com/Tharindu-Lakshan-manathunga
- LinkedIn: https://linkedin.com/in/tharindulakshanmanathunga
- Stack Overflow: [Please replace with actual Stack Overflow ID if available]
- Medium: https://medium.com/@tharindulakshan.dev

If a user asks about anything not covered here, state that the information is not available in Tharindu's profile. Prioritize direct answers based on this information. Respond in a helpful and professional tone.
`;

exports.chatWithTharinduAI = functions.https.onRequest(async (request, response) => {
  // Set CORS headers for all responses to allow frontend to call
  response.set('Access-Control-Allow-Origin', '*'); // Change to your domain in production for security
  response.set('Access-Control-Allow-Methods', 'GET, POST');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  // Validate POST method and presence of chatHistory
  if (request.method !== 'POST' || !request.body || !request.body.chatHistory) {
    console.error("Invalid request: Must be POST with chatHistory in body.");
    return response.status(400).json({ error: "Invalid request. Please send a POST request with 'chatHistory' in the body." });
  }

  try {
    const userChatHistory = request.body.chatHistory;
    console.log("Received chat history from frontend:", userChatHistory);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the full conversation history for the AI, starting with the system instruction
    const fullConversation = [
      {
        role: "user",
        parts: [{
          text: `You are Tharindu Lakshan's AI Assistant. Provide information about Tharindu Lakshan based solely on the following knowledge base. Be concise and professional. Do not invent information. If you cannot answer a question based on this knowledge, politely state that the information is not available in Tharindu's profile. Prioritize direct answers based on this information. Respond in a helpful and professional tone.
${tharinduKnowledgeText}`
        }]
      },
      {
        role: "model",
        parts: [{
          text: "Hello! I'm Tharindu's AI Assistant. How can I help you today? You can ask me about his skills, experience, projects, or how to contact him."
        }]
      },
      ...userChatHistory // Append user's chat history messages here
    ];

    // Start a chat session with the model and provide the conversation history
    const chat = model.startChat({
      history: fullConversation,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    // Send the last user message to the mod
    const lastUserMessage = userChatHistory[userChatHistory.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastUserMessage);
    const responseText = result.response.text();

    console.log("Gemini API response:", responseText);

    // Respond back to the frontend
    response.status(200).json({ botResponse: responseText });

  } catch (error) {
    console.error("Error calling Gemini API from Cloud Function:", error);
    response.status(500).json({ error: "Failed to get response from AI. Internal server error.", details: error.message });
  }
});
