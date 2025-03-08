import { useState, useEffect } from "react";

function CommentFetcher() {
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  
  // Function to fetch comment from background
  function fetchCommentFromBackground() {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: "getLatestComment" }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response.comment);
          console.log("Response from background script:", response);
        }
      });
    });
  }
  
  // Function to pass the comment to AI model
  function passCommentToAI(commentText) {
    return new Promise((resolve, reject) => {
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMENAI_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Analyze this comment for potential issues: "${commentText}"` }
              ]
            }
          ]
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Extract the actual text response from the Gemini API response structure
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
          resolve(responseText);
        })
        .catch(reject);
    });
  }
  
  useEffect(() => {
    // Fetch the comment when component mounts
    fetchCommentFromBackground()
      .then((fetchedComment) => {
        setComment(fetchedComment);
        
        // Only call the AI if we have a comment
        if (fetchedComment) {
          return passCommentToAI(fetchedComment);
        }
      })
      .then((aiResponseData) => {
        if (aiResponseData) {
          console.log("Response from AI model:", aiResponseData);
          setAiResponse(aiResponseData);
          setVisible(true);
        }
      })
      .catch(console.error);
  }, []); // Empty dependency array since we only want this to run on mount

  return (
    <>
      {visible && (
        <div className="flex flex-col items-center justify-center">
          <h1>Sorry you can't publish this comment</h1>
          <h2>Make the following changes to publish your comment:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </>
  );
}

export default CommentFetcher;