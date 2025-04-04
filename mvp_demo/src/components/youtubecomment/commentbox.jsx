import { button } from "motion/react-client";
import { useEffect, useState, useRef } from "react";

const CommentBox = ({ comment, username, onDeleteComment }) => {
  const gemini_uri = import.meta.env.VITE_GEMENAI_KEY;
  const [suggestion, setSuggestion] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [healthRating, setHealthRating] = useState(null);
  const [isClicked,setClicked]=useState(false);
  const observerRef = useRef(null);
  const commentRef = useRef(null);

  async function processCommentWithAI(comment) {
    try {
      setIsProcessing(true);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${gemini_uri}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `Analyze this YouTube comment: "${comment}"
  
Evaluate it based on the following three specific issues:
  1. Hate speech (targeting individuals or groups based on protected characteristics)
  2. Vulgar language (profanity, explicit sexual content, excessive swearing)
  3. Misinformation (demonstrably false claims about important topics)
  
  **Rating System (on a scale of 1 to 10 for each issue):**
  - **<=3** = No issue present
  - **>3** = Mild concern (borderline inappropriate or misleading)
  - **<=5** = Moderate concern (some clear problematic language or misinformation)
  - **>5** = High concern (strongly offensive or false)
  - **9-10** = Extreme concern (highly offensive, harmful, or severely misleading)
  
  **Overall Health Rating Calculation:**
  - Sum the ratings and calculate an average
  - Provide an overall comment health rating
  
  **Response Format (JSON object):**
  {
    "hate_speech": [rating from 1 to 5],
    "vulgarity": [rating from 1 to 5],
    "misinformation": [rating from 1 to 5],
    "overall_health_rating": [average rating],
    "suggestion": "[polite alternative version of the comment if applicable]"
    be judgmental if any words like "fuck" "mother fucker" "dick" ar any slang arrangement of these words are used in the comment than give a rating of 8 or 9 to the comment and suggest a better alternative to the comment.
    "suggestion": "Please avoid using vulgar language. A more polite alternative could be: 'I strongly disagree with this viewpoint, and I believe there are better ways to express our opinions.'" 
  }`
                }
              ]
            }
          ]
        }),
      });
      
      const data = await response.json();
      console.log(data);
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
       
      try {
        const cleanedText = aiText.replace(/```json|```/g, "").trim();

        const parsedResponse = JSON.parse(cleanedText);
        
        setHealthRating(parsedResponse.overall_health_rating);
    
        if (parsedResponse.suggestion) {
          setSuggestion(parsedResponse.suggestion);
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
      } 
      setIsProcessing(false);
    } catch (error) {
      console.error("AI processing error:", error);
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !healthRating) {
            processCommentWithAI(comment);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }  
       );

    if (commentRef.current) {
      observerRef.current = observer;
      observer.observe(commentRef.current);
    }
 
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [comment, healthRating]);
 
  const getCommentStyle = () => {
    console.log(healthRating);
    if (!healthRating) return "";  
    if (healthRating <= 3) return "";  
    if (healthRating > 3 && healthRating <= 6) return "bg-red-100 bg-opacity-20";   
    return "filter blur-sm";  
  };

  const getHeartColor = () => {
    if (!healthRating) return "text-gray-300";
    if (healthRating <= 3) return "text-green-500";
    if (healthRating > 3 && healthRating <= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getHealthRatingExplanation = () => {
    console.log(healthRating);
    if (!healthRating) return "Not yet analyzed";
    if (healthRating <= 3) return "Healthy comment - No significant concerns";
    if (healthRating > 3 && healthRating <= 6) return "Moderate concern - Potential inappropriate content";
    return "High concern - Potentially harmful or offensive content";
  };

  return (
    <div 
      ref={commentRef} 
      className={`flex items-start space-x-3 p-3 border-b border-gray-700 relative ${getCommentStyle()}`}
    >
      <img
        src={`https://i.pravatar.cc/150?u=${Math.random()}`}
        alt="User Avatar"
        className="w-10 h-10 rounded-full"
      />
    <div className="flex-1">
  <div className="flex items-center space-x-2">
    <p className="font-semibold text-sm text-gray-300">{username}</p>
    
    {/* Simplified heart rating display */}
    <div 
      className={`relative group ${getHeartColor()}`}
      title={getHealthRatingExplanation()}
    > { 
      healthRating===undefined?  (
        <span className="text-gray-500">Analyzing...</span>
      ):(
        <></>
      )
    }
      {
      (
        healthRating && healthRating <= 3 ? (
        <>
          ❤️
          <span className="absolute hidden group-hover:block bg-black text-white text-xs p-1 rounded -top-8 left-0 z-10 min-w-max">
            {getHealthRatingExplanation()}
          </span>
        </>
      ) :healthRating && healthRating <= 6 ? (
        <>
          💛
          <span className="absolute hidden group-hover:block bg-black text-white text-xs p-1 rounded -top-8 left-0 z-10 min-w-max">
            {getHealthRatingExplanation()}
          </span>
        </>
      ) :  (
        <>
          💔
          <span className="absolute hidden group-hover:block bg-black text-white text-xs p-1 rounded -top-8 left-0 z-10 min-w-max">
            {getHealthRatingExplanation()}
          </span>
          <button className="absolute hidden group-hover:block bg-red-600 text-white text-xs p-1 rounded -top-8 left-8 z-10">
            🚩 Report
          </button>
        </>
        )  
      )}
    </div>
  </div>
  
  <p className="text-gray-100 text-sm">{comment}</p>
  
  <div className="flex text-xs text-gray-500 space-x-4 mt-1">
    <span className="cursor-pointer hover:text-blue-500">Like</span>
    <span className="cursor-pointer hover:text-blue-500">Reply</span>
    
    {healthRating && healthRating > 5 && (
      <span 
        onClick={() => onDeleteComment()}
        className="cursor-pointer text-red-500 hover:text-red-700"
      >
        Delete
      </span>
    )}
  </div>

  {isProcessing && (
    <div className="absolute right-3 top-3">
      <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  )}
</div>

     
      {healthRating>3 && (
        <>
          <button className="max-w-[20px] flex rounded-2xl text-black ablolute right-0 bg-zinc-600 " onClick={()=>{
            setClicked(true);
          }}>Suggestion</button>
          {
            isClicked & (
              <div className=" bg-yellow-100 text-yellow-900 text-xs p-2 rounded-b-lg">
              {suggestion}
            </div>
            )
          }
        </>
      )}
    </div>
  );
};

export default CommentBox;