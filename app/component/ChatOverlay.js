import React, { useState, useRef, useEffect } from "react";

const ChatOverlay = ({ messages, onSend, onClose }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[400px] max-md:w-[95vw] max-h-[400px] h-[60vh] p-2 md:p-4 rounded-2xl bg-black/80 border border-white/20 shadow-2xl z-50 mx-auto backdrop-blur">
      <div className="flex justify-between items-center mb-2 border-b border-white/20 pb-2">
        <div className="font-bold text-lg max-md:text-base text-white">Chat</div>
        <button onClick={onClose} className="text-red-400 hover:text-red-600 font-bold text-lg max-md:text-base transition-colors">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto bg-black/30 rounded p-2 mb-2 text-sm max-md:text-xs text-white">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold text-blue-300">{msg.user}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex mt-2 gap-1">
        <input
          className="flex-1 border border-white/20 rounded-l px-2 py-1 max-md:text-xs bg-black/40 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-buttonPrimary text-white px-4 py-1 rounded-r max-md:text-xs hover:bg-purple-700 transition-colors">Send</button>
      </form>
    </div>
  );
};

export default ChatOverlay; 