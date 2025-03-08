
let latestAIResponse = null;

// Function to process comment with AI
async function processCommentWithAI(comment) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCUFIqU7V9jQMmr69kXuVkQh38W4Xzsuho`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Analyze this comment for potential issues: "${comment}"` }
            ]
          }
        ]
      }),
    });
    
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    latestAIResponse = aiText;
    return aiText;
  } catch (error) {
    console.error("AI processing error:", error);
    return "Error processing with AI";
  }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "logElements") {
    // Process the comment with AI
    processCommentWithAI(request.comment)
      .then(aiResponse => {
        sendResponse({ success: true, aiResponse });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });
    return true; // Required for async sendResponse
  }
  
  // Handle requests for the latest AI response
  if (request.action === "getLatestAIResponse") {
    sendResponse({ success: true, aiResponse: latestAIResponse });
    return true;
  }
});