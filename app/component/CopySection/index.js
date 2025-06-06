"use client"
import { Copy , Check } from "lucide-react";
import { useState } from "react";
const CopySection = (props) => {
  const { roomId } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard.writeText(roomId);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="hidden md:flex flex-col fixed text-white border border-white rounded-xl p-2 left-[30px] bottom-[100px] bg-black/70 shadow-lg max-md:w-[90vw] max-md:left-1/2 max-md:-translate-x-1/2 max-md:bottom-4 max-md:text-center z-30">
      <div className="text-base">Copy Room ID:</div>
      <hr className="my-1" />
      <div className="flex items-center justify-center text-sm gap-2">
        <span>{roomId}</span>
        {copied ? <Check className="ml-3 cursor-pointer" /> : <Copy className="ml-3 cursor-pointer" onClick={handleCopy} />}
      </div>
    </div>
  );
};

export default CopySection;