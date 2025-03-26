import React, { useState, useEffect } from "react";
import CommentBox from "../youtubecomment/commentbox";

const HomePage = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  let typingTimeout = null;

  // Function to check comment using AI
  async function processCommentWithAI(comment) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMENAI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze this YouTube comment: "${comment}"
                      
                      Check ONLY for the following three specific issues:
                      1. Hate speech
                      2. Vulgar language
                      3. Misinformation
                      
                      If NONE of these issues are found, respond with "PASS".
                      If issues are found, respond in this exact format:
                      "ISSUE_FOUND: [brief description]
                      SUGGESTION: [polite alternative version]"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "PASS";

      if (aiText !== "PASS") {
        setAiSuggestion(aiText);
        setIsBlocked(true);
      } else {
        setAiSuggestion(null);
        setIsBlocked(false);
      }
    } catch (error) {
      console.error("AI processing error:", error);
    }
  }

  // Delay AI request after typing stops for 5 seconds
  useEffect(() => {
    if (comment.trim() === "") {
      setAiSuggestion(null);
      setIsBlocked(false);
      return;
    }

    setIsChecking(true);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      processCommentWithAI(comment);
      setIsChecking(false);
    }, 5000);

    return () => clearTimeout(typingTimeout);
  }, [comment]);

  // Handle comment submission
  const handleAddComment = () => {
    if (isBlocked) return;
    setComments([{ id: Date.now(), username: "User", comment }, ...comments]);
    setComment("");
  };

  return (
    <div className="max-w-full lg:max-w-2xl mx-auto bg-[#181818] text-white shadow-lg p-4 rounded-lg mt-6 mb-2">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <input
          type="text"
          className="flex-1 border border-gray-600 bg-[#202020] p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          disabled={isBlocked}
          className={`px-4 py-2 rounded-lg ${
            isBlocked ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Comment
        </button>
      </div>

      {/* AI Suggestion Box */}
      {aiSuggestion && (
        <div className="bg-yellow-200 text-yellow-900 p-3 rounded-lg mb-3">
          <p className="text-sm">⚠ AI detected an issue in your comment.</p>
          <p className="font-semibold">Suggestion:</p>
          <p className="italic">{aiSuggestion.split("SUGGESTION:")[1]?.trim()}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                setComment(aiSuggestion.split("SUGGESTION:")[1]?.trim() || comment);
                setAiSuggestion(null);
                setIsBlocked(false);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded-lg"
            >
              Accept Suggestion
            </button>
            <button
              onClick={() => {
                setAiSuggestion(null);
                setIsBlocked(true);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-4 h-[28em] rounded-2xl shadow overflow-auto">
        {comments.map((c) => (
          <CommentBox key={c.id} comment={c.comment} username={c.username} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
