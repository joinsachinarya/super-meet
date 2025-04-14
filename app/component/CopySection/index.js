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
    <div className="flex flex-col absolute text-white border border-white rounded p-2 left-[30px] bottom-[100px]">
      <div className="text-base">Copy Room ID:</div>
      <hr className="my-1" />
      <div className="flex items-center text-sm">
        <span>{roomId}</span>
        {copied ? <Check className="ml-3 cursor-pointer" /> : <Copy className="ml-3 cursor-pointer" onClick={handleCopy} />}
      </div>
    </div>
  );
};

export default CopySection;