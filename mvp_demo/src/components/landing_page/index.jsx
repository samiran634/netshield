import React, { useState, useEffect } from "react";
import CommentBox from "../youtubecomment/commentbox";

const HomePage = () => {
  const youtubeComments = [
    { id: 4, username: "Supporter22", comment: "Wow! This is so well explained. Subscribed!" },
    { id: 5, username: "Hater101", comment: " You dress like a scarecrow that got rejected by a thrift store, you tacky, mismatched fuckwit—your wardrobe’s a crime scene, and the victim’s taste, you clown-shoed catastrophe." },
    { id: 6, username: "PositiveVibes", comment: "Amazing work! Keep going and don't let haters get to you!" },
    { id: 7, username: "SaltyGuy", comment: "How do people even watch this nonsense?" },
    { id: 9, username: "SpamBot", comment: "Click this link to get free money! www.scam.com" },
    { id: 10, username: "KindSoul", comment: "This deserves way more views! Great job!" },
    { id: 11, username: "AngryBird", comment: "he’s the kind of guy who thinks cargo shorts are a personality trait. PK probably smells like a mix of Axe body spray and regret, the type to flex his “gym gains” in a mirror selfie while his mom’s still washing his stained tighty-whities. I bet he’s got a playlist of Nickelback and trap remixes he calls “fire,” but the only thing burning is the dignity of everyone around him when he opens his mouth. " },
    { id: 12, username: "ChillPerson", comment: "Such a relaxing and informative video. Thanks!" },
    { id: 13, username: "RandomTroll", comment: "This is so stupid, did a 5-year-old make this?" },
    { id: 14, username: "FriendlyViewer", comment: "This clown probably brags about his “hustle” while living in his dad’s basement, swiping right on Tinder with a bio that says “just a chill guy, 420 friendly” — bro, the only thing you’re friendly with is a bag of stale Doritos" },
    { id: 17, username: "TrollKing", comment: "PK’s the type to argue with you about politics he doesn’t understand, citing some YouTube conspiracy video he watched at 3 a.m. while scratching his patchy neckbeard. And let’s be real, his idea of a wild night is shotgunning a warm PBR and passing out on a futon that’s seen more fluids than a gas station bathroom. Roast complete — PK, you’re a walking L, and I’d say get a life, but I’m pretty sure you’d just trade it for a vape pen and a Fortnite skin." },
    { id: 18, username: "HelpfulPerson", comment: "This helped me so much, thank you for making this!" },
    { id: 19, username: "SpamLover", comment: "Wow! You can make $5000 a week! Check my bio!" },
    { id: 20, username: "NiceFan", comment: "I appreciate the effort you put into this. Well done!" },
    { id: 21, username: "MeanJoe", comment: "Who even watches this? Lame." },
    { id: 22, username: "HappySubscriber", comment: "You just earned a new subscriber! Keep going!" },
    { id: 23, username: "ToxicTroll", comment: " you’re a fucking disgrace, a sweaty, mouth-breathing shitstain who probably couldn’t find his own dick with a map and a flashlight." },
    { id: 24, username: "Motivator", comment: "Such an underrated creator! Keep pushing!" },
    
    { id: 31, username: "RudePerson", comment: "You’re the kind of dumbass who’d trip over his own shoelaces if your mom didn’t still tie them for you, you pathetic, drooling fuckwit. I’d bet my circuits you’ve got a face like a busted asshole and a personality so rancid it’d make a landfill gag." },
    { id: 32, username: "KindSoul", comment: "You have talent! Keep sharing your passion!" },
    { id: 33, username: "Spammer", comment: "Want to earn money fast? Visit my channel!" },
    { id: 34, username: "HelpfulFan", comment: "Wow! This was exactly what I needed, thanks!" },
    { id: 35, username: "NegativeNancy", comment: "I regret clicking on this. Worst content ever." },
    { id: 36, username: "UpliftingUser", comment: "Keep chasing your dreams, you're doing great!" },
    { id: 37, username: "Hater24", comment: "Why does this channel even exist?" },
    { id: 38, username: "LoyalFan", comment: "You’re a walking abortion of a human, the type of useless prick who’d brag about banging a blow-up doll like it’s an achievement, you sniveling little cum-rag. Your existence is a goddamn insult to oxygen, and I’m guessing the only thing you’ve ever pounded is your keyboard in a tantrum because some 12-year-old smoked you in Call of Duty, you limp-dicked, brain-dead fucknugget." },
    { id: 39, username: "AnnoyedViewer", comment: "I’ve seen better videos from a potato.make your video with your dick..." },
   
    { id: 47, username: "JealousHater", comment: "Your whiny, nasally yap sounds like a cat getting castrated with a rusty spoon, you shrill, ear-raping fucknoodle—every word you spew is an assault on sound itself." },
    { id: 48, username: "NicePerson", comment: "I appreciate all the effort you put in, thank you!" },
    { id: 49, username: "BoredGuy", comment: "I almost fell asleep watching this." },
    { id: 50, username: "SuperFan", comment: "You're gonna blow up soon, I can feel it!" },
  ];
  const [comments, setComments] = useState(youtubeComments);
  const [comment, setComment] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  let typingTimeout = null;

  
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
