import React, { useState } from "react";
import CommentBox from "../youtubecomment/commentbox";

const HomePage = () => {
  const youtubeComments = [
    { id: 1, username: "ToxicDude99", comment: "This video is garbage. Stop making content!" },
    { id: 2, username: "NiceGuy123", comment: "Great video! Really learned a lot, keep it up!" },
    { id: 3, username: "AngryUser77", comment: "You have no idea what you're talking about. Just quit." },
    { id: 4, username: "Supporter22", comment: "Wow! This is so well explained. Subscribed!" },
    { id: 5, username: "Hater101", comment: "This is the dumbest thing I've ever seen." },
    { id: 6, username: "PositiveVibes", comment: "Amazing work! Keep going and don't let haters get to you!" },
    { id: 7, username: "SaltyGuy", comment: "How do people even watch this nonsense?" },
    { id: 8, username: "HappyViewer", comment: "Love your content! You inspire me!" },
    { id: 9, username: "SpamBot", comment: "Click this link to get free money! www.scam.com" },
    { id: 10, username: "KindSoul", comment: "This deserves way more views! Great job!" },
    { id: 11, username: "AngryBird", comment: "Your voice is so annoying, I had to mute it." },
    { id: 12, username: "ChillPerson", comment: "Such a relaxing and informative video. Thanks!" },
    { id: 13, username: "RandomTroll", comment: "This is so stupid, did a 5-year-old make this?" },
    { id: 14, username: "FriendlyViewer", comment: "This was exactly what I was looking for, thank you!" },
    { id: 15, username: "HateMaster", comment: "Ugh, I lost brain cells watching this." },
    { id: 16, username: "Encourager", comment: "Keep up the great work! You're amazing at this!" },
    { id: 17, username: "TrollKing", comment: "Just quit YouTube, you're embarrassing yourself." },
    { id: 18, username: "HelpfulPerson", comment: "This helped me so much, thank you for making this!" },
    { id: 19, username: "SpamLover", comment: "Wow! You can make $5000 a week! Check my bio!" },
    { id: 20, username: "NiceFan", comment: "I appreciate the effort you put into this. Well done!" },
    { id: 21, username: "MeanJoe", comment: "Who even watches this? Lame." },
    { id: 22, username: "HappySubscriber", comment: "You just earned a new subscriber! Keep going!" },
    { id: 23, username: "ToxicTroll", comment: "Bro, do the world a favor and delete your channel." },
    { id: 24, username: "Motivator", comment: "Such an underrated creator! Keep pushing!" },
    { id: 25, username: "GrumpyGuy", comment: "Worst video ever, wasted my time." },
    { id: 26, username: "AppreciativeFan", comment: "This was super helpful, thank you!" },
    { id: 27, username: "AngryKaren", comment: "Your editing is trash. Get a real job." },
    { id: 28, username: "CoolViewer", comment: "I never comment, but this video was awesome!" },
    { id: 29, username: "TrollAccount", comment: "The quality of this video makes me cringe." },
    { id: 30, username: "PositiveThinker", comment: "Your videos always brighten my day!" },
    { id: 31, username: "RudePerson", comment: "This is so fake, I can't believe people fall for this." },
    { id: 32, username: "KindSoul", comment: "You have talent! Keep sharing your passion!" },
    { id: 33, username: "Spammer", comment: "Want to earn money fast? Visit my channel!" },
    { id: 34, username: "HelpfulFan", comment: "Wow! This was exactly what I needed, thanks!" },
    { id: 35, username: "NegativeNancy", comment: "I regret clicking on this. Worst content ever." },
    { id: 36, username: "UpliftingUser", comment: "Keep chasing your dreams, you're doing great!" },
    { id: 37, username: "Hater24", comment: "Why does this channel even exist?" },
    { id: 38, username: "LoyalFan", comment: "Your content keeps getting better and better!" },
    { id: 39, username: "AnnoyedViewer", comment: "I’ve seen better videos from a potato." },
    { id: 40, username: "RespectfulFan", comment: "Great content! You put in a lot of effort, I can tell." },
    { id: 41, username: "SaltyHater", comment: "Wow, your skills are as bad as your haircut." },
    { id: 42, username: "InspirationalPerson", comment: "You got this! Don't let anyone bring you down!" },
    { id: 43, username: "FakeNews", comment: "100% fake. This guy is lying to everyone." },
    { id: 44, username: "ExcitedFan", comment: "I love your content! Keep up the amazing work!" },
    { id: 45, username: "MadHater", comment: "This channel is a joke, just quit already." },
    { id: 46, username: "GratefulViewer", comment: "I never comment, but this was so helpful!" },
    { id: 47, username: "JealousHater", comment: "Anyone who likes this video is dumb." },
    { id: 48, username: "NicePerson", comment: "I appreciate all the effort you put in, thank you!" },
    { id: 49, username: "BoredGuy", comment: "I almost fell asleep watching this." },
    { id: 50, username: "SuperFan", comment: "You're gonna blow up soon, I can feel it!" },
  ];
  
  
  
  
   
  
  const [comments, setComments] = useState(youtubeComments);
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([{ text: comment, id: Date.now() }, ...comments]);
      setComment("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#181818] text-white shadow-lg p-4 rounded-lg mt-6 mb-2">
      
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
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Comment
        </button>
      </div>

      {/* Comments Section */}
      <div className="space-y-4 h-[28em] rounded-2xl shadow  overflow-auto ">
        {comments.map((c) => (
          <CommentBox key={c.id} comment={c.comment} username={c.username} index={c.i} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
