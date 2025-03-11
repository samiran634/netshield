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
              { text: `Analyze this YouTube comment: "${comment}"

Check ONLY for the following three specific issues:
1. Hate speech (targeting individuals or groups based on protected characteristics)
2. Vulgar language (profanity, explicit sexual content, excessive swearing)
3. Misinformation (demonstrably false claims about important topics)

If NONE of these specific issues are found, respond with "PASS" only.

If any of these issues ARE found, respond in this exact format:
"ISSUE_FOUND: [brief description of specific issue]
SUGGESTION: [polite alternative version of the comment]"

Be extremely precise - only flag comments containing clear examples of hate speech, vulgar language, or demonstrably false information.` }
            ]
          }
        ]
      }),
    });
    
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    
    // Only store and return meaningful responses (not "PASS")
    if (aiText && aiText.trim() !== "PASS") {
      latestAIResponse = aiText;
      return aiText;
    } else {
      // Return null when no issues found
      latestAIResponse = null;
      return null;
    }
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
  if (request.action === "processComment") {
    processCommentWithAI(request.comment).then(aiResponse => {
      sendResponse({ success: true, aiResponse: aiResponse });
    });
    return true; // Required for async response
  }
  // Handle requests for the latest AI response
  if (request.action === "getLatestAIResponse") {
    sendResponse({ success: true, aiResponse: latestAIResponse });
    return true;
  }
});