import { button } from "motion/react-client";
import { useEffect, useState, useRef  } from "react";
import {useNavigate} from "react-router-dom";
const CommentBox = ({ comment, username, onDeleteComment }) => {
  const navigate = useNavigate();
 
  const [isClicked,setClicked]=useState(false);
  const observerRef = useRef(null);
  const commentRef = useRef(null);

  

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
    
   
  </div>
  
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