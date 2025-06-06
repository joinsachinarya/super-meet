import React, { useRef, useEffect, useState } from "react";

const WhiteboardOverlay = ({ onDraw, onClose, remoteDrawEvents }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw remote events
    if (remoteDrawEvents) {
      remoteDrawEvents.forEach(ev => {
        ctx.beginPath();
        ctx.moveTo(ev.from.x, ev.from.y);
        ctx.lineTo(ev.to.x, ev.to.y);
        ctx.strokeStyle = ev.color || "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [remoteDrawEvents]);

  const handleMouseDown = (e) => {
    setDrawing(true);
    setLastPoint(getPos(e));
  };
  const handleMouseUp = () => {
    setDrawing(false);
    setLastPoint(null);
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const newPoint = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (onDraw) onDraw({ from: lastPoint, to: newPoint, color: "#000" });
    setLastPoint(newPoint);
  };
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <div className="flex flex-col h-full w-full max-w-[400px] max-md:w-[95vw] max-h-[400px] h-[60vh] p-2 md:p-4 rounded-2xl bg-black/80 border border-white/20 shadow-2xl z-50 mx-auto backdrop-blur">
      <div className="flex justify-between items-center mb-2 border-b border-white/20 pb-2">
        <div className="font-bold text-lg max-md:text-base text-white">Whiteboard</div>
        <button onClick={onClose} className="text-red-400 hover:text-red-600 font-bold text-lg max-md:text-base transition-colors">✕</button>
      </div>
      <canvas
        ref={canvasRef}
        width={350}
        height={350}
        className="border-2 border-white/20 rounded bg-white/90 cursor-crosshair w-full h-full max-h-[300px] shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ touchAction: "none" }}
      />
    </div>
  );
};

export default WhiteboardOverlay; 