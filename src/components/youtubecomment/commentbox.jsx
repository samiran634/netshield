import { useEffect,useState } from "react";
const CommentBox = ({ comment ,username}) => {
    const [suggestion,setSuggestion]=useState("");
    async function processCommentWithAI(comment) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_URI}`, {
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
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
           
          if (aiText && aiText.trim() !== "PASS") {
          
            return aiText;
          } else {
             
            return null;
          }
        } catch (error) {
          console.error("AI processing error:", error);
          return "Error processing with AI";
        }
      }
    useEffect(()=>{
        setTimeout(() => {
            setSuggestion(processCommentWithAI(comment))
        }, 2000);
        console.log(suggestion);
    },[comment])

    return (
      <div className="flex items-start space-x-3 p-3 border-b border-gray-700">
        <img
          src= {`https://i.pravatar.cc/150?u=${Math.random()}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-sm text-gray-300">{username}</p>
          <p className="text-gray-100 text-sm">{comment}</p>
          <div className="flex text-xs text-gray-500 space-x-4 mt-1">
            <span className="cursor-pointer hover:text-blue-500">Like</span>
            <span className="cursor-pointer hover:text-blue-500">Reply</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default CommentBox;
  