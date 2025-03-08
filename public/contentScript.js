//function for fetching the realtime comments from the youtube video
function findCommentBox() {
  let commentBox = document.querySelector("#contenteditable-root");

  if (commentBox) {
    console.log("Comment box found!", commentBox);
    
    //container for AI feedback
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
    let acceptBn=document.querySelector("#accept");
    let rejectBn=document.querySelector("#reject");
    if(!acceptBn){ 
      acceptBn=document.createElement("button");
      acceptBn.id="accept";
      acceptBn.textContent="Accept";
      acceptBn.style.position = "absolute";
      acceptBn.style.zIndex = "10000";
      acceptBn.style.backgroundColor = "white";
      acceptBn.style.padding = "10px";
      acceptBn.style.border = "1px solid #ccc";
      acceptBn.style.borderRadius = "5px";
      acceptBn.style.display = "none";
      acceptBn.style.maxWidth = "300px";
      acceptBn.style.top = "50px";
      acceptBn.style.left = "50px";
  
    } if(!rejectBn){
      rejectBn=document.createElement("button");
      rejectBn.id="reject";
      rejectBn.textContent="Reject";
      rejectBn.style.position = "absolute";
      rejectBn.style.zIndex = "10000";
      rejectBn.style.backgroundColor = "red";
      rejectBn.style.padding = "10px";
      rejectBn.style.border = "1px solid #ccc";
      rejectBn.style.borderRadius = "5px";
      rejectBn.style.display = "none";
      rejectBn.style.maxWidth = "300px";
      rejectBn.style.top = "50px";
      rejectBn.style.left = "150px";
     
    }


    commentBox.addEventListener("input", function() {
      chrome.runtime.sendMessage({
        action: "logElements",
        comment: commentBox.innerText
      }, response => {
        console.log("Response from background script:", response);
        
        if (response && response.success && response.aiResponse) {
          // Show AI feedback
          aiFeedbackContainer.textContent = response.aiResponse;
          aiFeedbackContainer.style.display = "block";
          aiFeedbackContainer.appendChild(acceptBn);
          aiFeedbackContainer.appendChild(rejectBn);
          // Position the feedback near the comment box
          const rect = commentBox.getBoundingClientRect();
          aiFeedbackContainer.style.top = (rect.bottom + 10) + "px";
          aiFeedbackContainer.style.left = rect.left + "px";
        }
      });
    });
  } else {
    console.log("Comment box not found, retrying...");
    setTimeout(findCommentBox, 1000);
  }
}

// Wait for the document to load and try to find the comment box
window.onload = findCommentBox;