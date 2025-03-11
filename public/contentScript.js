 
let latestAIResponse = null;
let commentHasIssues = false;
let inputTaken="";
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
    
    // Check if there are issues
    if (aiText && aiText.trim() !== "PASS") {
      latestAIResponse = aiText;
      commentHasIssues = true;
      return aiText;
    } else {
      // No issues found
      latestAIResponse = null;
      commentHasIssues = false;
      return null;
    }
  } catch (error) {
    console.error("AI processing error:", error);
    // Don't block submission in case of error
    commentHasIssues = false;
    return "Error processing with AI";
  }
}

function findCommentBox() {
  let commentBox = document.querySelector("#contenteditable-root");
  
  if (commentBox) {
    console.log("Comment box found!", commentBox);
    
    // Container for AI feedback
    let aiFeedbackContainer = document.createElement("div");
    aiFeedbackContainer.id = "ai-feedback-container";
    aiFeedbackContainer.style.position = "absolute";
    aiFeedbackContainer.style.zIndex = "10000";
    aiFeedbackContainer.style.backgroundColor = "white";
    aiFeedbackContainer.style.padding = "10px";
    aiFeedbackContainer.style.border = "1px solid #ccc";
    aiFeedbackContainer.style.borderRadius = "5px";
    aiFeedbackContainer.style.display = "none";
    aiFeedbackContainer.style.maxWidth = "300px";
    
    // Add the container near the comment box
    const commentSection = commentBox.closest("ytd-comments-header-renderer") || document.body;
    commentSection.appendChild(aiFeedbackContainer);
    
    // Create buttons
    let acceptBtn = document.createElement("button");
    acceptBtn.id = "accept";
    acceptBtn.textContent = "Accept";
    acceptBtn.style.margin = "5px";
    acceptBtn.style.padding = "5px 10px";
    acceptBtn.style.border = "1px solid #ccc";
    acceptBtn.style.borderRadius = "5px";
    acceptBtn.style.backgroundColor = "#4CAF50";
    acceptBtn.style.color = "white";
    
    let rejectBtn = document.createElement("button");
    rejectBtn.id = "reject";
    rejectBtn.textContent = "Reject";
    rejectBtn.style.margin = "5px";
    rejectBtn.style.padding = "5px 10px";
    rejectBtn.style.border = "1px solid #ccc";
    rejectBtn.style.borderRadius = "5px";
    rejectBtn.style.backgroundColor = "#f44336";
    rejectBtn.style.color = "white";
    
    // Add buttons  
    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.appendChild(acceptBtn);
    buttonContainer.appendChild(rejectBtn);
    aiFeedbackContainer.appendChild(buttonContainer);
    
    // Add button functionality
    acceptBtn.addEventListener("click", function() {
      if (aiFeedbackContainer.dataset.suggestion) {
        commentBox.innerText = aiFeedbackContainer.dataset.suggestion;
        commentHasIssues = false; // Reset flag as we've accepted the suggestion
      }
      aiFeedbackContainer.style.display = "none";
    });
    
    rejectBtn.addEventListener("click", function() {
      aiFeedbackContainer.style.display = "none";
    });
    let checkInterval;
    
    commentBox.addEventListener("input", function() {
      // Clear any existing interval
      if (checkInterval) clearInterval(checkInterval);
      inputTaken+=commentBox.innerText;
      // Start a new interval
      checkInterval = setInterval(() => {
        chrome.runtime.sendMessage({
          action: "processComment",
          comment: inputTaken,
        }, response => {
          console.log("Response from background script:", response);
          
          if (response && response.aiResponse) {
            const match = response.aiResponse.match(/SUGGESTION: (.*)/);
            const suggestion = match ? match[1] : "";
            
            // Store the suggestion for later use
            aiFeedbackContainer.dataset.suggestion = suggestion;
            
            // Show AI feedback text
            const feedbackText = document.createElement("div");
            feedbackText.textContent = response.aiResponse;
            
            // Clear previous content and add new
            aiFeedbackContainer.innerHTML = '';
            aiFeedbackContainer.appendChild(feedbackText);
            aiFeedbackContainer.appendChild(buttonContainer);
            
            aiFeedbackContainer.style.display = "block";
            
            // Position the feedback near the comment box
            const rect = commentBox.getBoundingClientRect();
            aiFeedbackContainer.style.top = (rect.bottom + 10) + "px";
            aiFeedbackContainer.style.left = rect.left + "px";
          }
        });
      }, 1000);
    });
    
    // Find and intercept the submit button
    interceptSubmitButton();
  } else {
    console.log("Comment box not found, retrying...");
    setTimeout(findCommentBox, 1000);
  }
}

// Function to find and intercept the submit button
function interceptSubmitButton() {
  // YouTube comment submit button selector may vary
  const possibleSelectors = [
    "ytd-button-renderer#submit-button",
    "button.yt-spec-button-shape-next--filled",
    "button[aria-label='Comment']"
  ];
  
  let submitButton = null;
  
  for (const selector of possibleSelectors) {
    const button = document.querySelector(selector);
    if (button) {
      submitButton = button;
      break;
    }
  }
  
  if (submitButton) {
    console.log("Submit button found:", submitButton);
    
    // Create a wrapper for the original click event
    const originalClick = submitButton.onclick;
    
    submitButton.onclick = function(event) {
      if (commentHasIssues) {
        // Block submission and show warning
        event.preventDefault();
        event.stopPropagation();
        
        // Show warning message if not already visible
        if (document.getElementById("ai-feedback-container").style.display === "none") {
          alert("Please fix the issues in your comment before submitting.");
        }
        
        return false;
      }
      
      // If no issues, proceed with original click handler
      if (originalClick) {
      
        return originalClick.call(this, event);
      }
      if(commentBox.innerText===inputTaken){
        console.log("No new input detected");
        event.stopPropagation();
        return false;
      }
   
    };
    
    // Also capture the event at the capture phase for buttons that use event listeners
    submitButton.addEventListener("click", function(event) {
      if (commentHasIssues) {
        event.preventDefault();
        event.stopPropagation();
        
        // Show warning message if not already visible
        if (document.getElementById("ai-feedback-container").style.display === "none") {
          alert("Please fix the issues in your comment before submitting.");
        }
      }
    }, true);
  } else {
    console.log("Submit button not found, retrying...");
    setTimeout(interceptSubmitButton, 1000);
  }
}

// Wait for the document to load and try to find the comment box
window.onload = findCommentBox;