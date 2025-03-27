let latestAIResponse = null;
let commentHasIssues = false;
let inputTaken="";
const vulgarWords = ["badword1", "badword2", "offensiveword"];

function findCommentBox() {
  let commentBox = document.querySelector("#contenteditable-root");
  
  if (commentBox) {
    console.log("Comment box found!", commentBox);
    
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

    const commentSection = commentBox.closest("ytd-comments-header-renderer") || document.body;
    commentSection.appendChild(aiFeedbackContainer);
    
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
    
    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.appendChild(acceptBtn);
    buttonContainer.appendChild(rejectBtn);
    aiFeedbackContainer.appendChild(buttonContainer);
    
    acceptBtn.addEventListener("click", function() {
      if (aiFeedbackContainer.dataset.suggestion) {
        commentBox.innerText = aiFeedbackContainer.dataset.suggestion;
        commentHasIssues = false;
      }
      aiFeedbackContainer.style.display = "none";
    });
    
    rejectBtn.addEventListener("click", function() {
      aiFeedbackContainer.style.display = "none";
    });
    
    let checkInterval;
    commentBox.addEventListener("input", function() {
      if (checkInterval) clearInterval(checkInterval);
      let previousComment = "";
      let counter = 0;
      
      checkInterval = setInterval(() => {
        let currentText = commentBox.innerText;
        console.log(currentText);
        
        if (currentText === previousComment) {
          counter++;
          if (counter === 5) clearInterval(checkInterval);
        } else {
          counter = 0;
          previousComment = currentText;
        }
        
        if (containsVulgarWords(currentText)) {
          hideSubmitButton(true);
        } else {
          hideSubmitButton(false);
        }
        
        chrome.runtime.sendMessage({
          action: "processComment",
          comment: currentText,
        }, response => {
          console.log("Response from background script:", response);
          
          if (response && response.aiResponse) {
            const match = response.aiResponse.match(/SUGGESTION: (.*)/);
            const suggestion = match ? match[1] : "";
            aiFeedbackContainer.dataset.suggestion = suggestion;
              
            const feedbackText = document.createElement("div");
            feedbackText.textContent = response.aiResponse;
              
            aiFeedbackContainer.innerHTML = '';
            aiFeedbackContainer.appendChild(feedbackText);
            aiFeedbackContainer.appendChild(buttonContainer);
            
            aiFeedbackContainer.style.display = "block";
            const rect = commentBox.getBoundingClientRect();
            aiFeedbackContainer.style.top = (rect.bottom + 10) + "px";
            aiFeedbackContainer.style.left = rect.left + "px";
          }
        });
      }, 1000);
    });
    
    interceptSubmitButton();
  } else {
    console.log("Comment box not found, retrying...");
    setTimeout(findCommentBox, 1000);
  }
}

function containsVulgarWords(text) {
  return vulgarWords.some(word => text.toLowerCase().includes(word));
}

function hideSubmitButton(hide) {
  const submitButton = document.querySelector("button.yt-spec-button-shape-next--filled");
  if (submitButton) {
    submitButton.style.display = hide ? "none" : "inline-block";
  }
}

function interceptSubmitButton() {
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
    const originalClick = submitButton.onclick;
    
    submitButton.onclick = function(event) {
      if (commentHasIssues) {
        event.preventDefault();
        event.stopPropagation();
        alert("Please fix the issues in your comment before submitting.");
        return false;
      }
      if (originalClick) return originalClick.call(this, event);
    };
  } else {
    console.log("Submit button not found, retrying...");
    setTimeout(interceptSubmitButton, 1000);
  }
}

window.onload = findCommentBox;