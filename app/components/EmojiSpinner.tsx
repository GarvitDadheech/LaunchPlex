import React, { useState, useEffect } from "react";

const EmojiSpinner: React.FC = () => {
  const emojis = ["⏳", "🕐", "⌛", "🕒", "⏳", "🕔", "⌛", "🕗"];
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prevIndex) => (prevIndex + 1) % emojis.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [emojis.length]);

  return (
    <div className="text-sm sm:text-md font-bold text-white">
      <span>Please Wait! You may have to sign few transactions... </span>
      <span className="text-lg">{emojis[currentEmojiIndex]}</span>
    </div>
  );
};

export default EmojiSpinner;
