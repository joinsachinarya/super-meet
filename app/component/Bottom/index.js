import { Mic, Video, Phone, MicOff, VideoOff, ScreenShare, ScreenShareOff, MessageCircle, Pencil } from "lucide-react";

const Bottom = (props) => {
  const { muted, playing, toggleAudio, toggleVideo, leaveRoom, toggleScreenShare, screenShareActive, toggleChat, chatActive, toggleWhiteboard, whiteboardActive } = props;

  return (
    <div className="fixed flex justify-between items-center gap-2 bottom-3 left-1/2 -translate-x-1/2 w-full max-w-[400px] max-md:w-[95vw] px-2 py-2 bg-black/60 backdrop-blur rounded-2xl z-40">
      {/* Chat toggle */}
      <MessageCircle
        size={window.innerWidth < 768 ? 40 : 55}
        className={`p-2 md:p-4 rounded-full text-white cursor-pointer transition-all duration-200 shadow-md ring-2 ring-transparent ${chatActive ? 'bg-buttonPrimary ring-buttonPrimary' : 'bg-secondary'} hover:bg-purple-700 hover:ring-purple-400 active:scale-95`}
        onClick={toggleChat}
      />
      {/* Whiteboard toggle */}
      <Pencil
        size={window.innerWidth < 768 ? 40 : 55}
        className={`p-2 md:p-4 rounded-full text-white cursor-pointer transition-all duration-200 shadow-md ring-2 ring-transparent ${whiteboardActive ? 'bg-gradient-to-tr from-yellow-400 to-pink-500 ring-yellow-400' : 'bg-secondary'} hover:bg-gradient-to-tr hover:from-yellow-400 hover:to-pink-500 hover:ring-yellow-400 active:scale-95`}
        onClick={toggleWhiteboard}
      />
      {/* Existing controls */}
      {muted ? (
        <MicOff
          className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-secondary hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-md ring-2 ring-transparent hover:ring-red-400 active:scale-95"
          size={window.innerWidth < 768 ? 40 : 55}
          onClick={toggleAudio}
        />
      ) : (
        <Mic
          className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-secondary hover:bg-green-600 active:bg-green-700 transition-all duration-200 shadow-md ring-2 ring-transparent hover:ring-green-400 active:scale-95"
          size={window.innerWidth < 768 ? 40 : 55}
          onClick={toggleAudio}
        />
      )}
      {playing ? (
        <Video
          className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-secondary hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-md ring-2 ring-transparent hover:ring-blue-400 active:scale-95"
          size={window.innerWidth < 768 ? 40 : 55}
          onClick={toggleVideo}
        />
      ) : (
        <VideoOff
          className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-secondary hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 shadow-md ring-2 ring-transparent hover:ring-blue-400 active:scale-95"
          size={window.innerWidth < 768 ? 40 : 55}
          onClick={toggleVideo}
        />
      )}
      {!screenShareActive ? (
        <ScreenShareOff
          size={window.innerWidth < 768 ? 40 : 55}
          className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-secondary hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 shadow-md ring-2 ring-transparent hover:ring-orange-400 active:scale-95"
          onClick={toggleScreenShare}
        />
      ) : (
        <ScreenShare
          size={window.innerWidth < 768 ? 40 : 55}
          className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-gradient-to-tr from-orange-400 to-yellow-400 hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 shadow-md ring-2 ring-orange-400 active:scale-95"
          onClick={toggleScreenShare}
        />
      )}
      <Phone
        size={window.innerWidth < 768 ? 40 : 55}
        className="p-2 md:p-4 rounded-full text-white cursor-pointer bg-buttonPrimary hover:bg-red-600 active:bg-red-700 transition-all duration-200 shadow-md ring-2 ring-transparent hover:ring-red-400 active:scale-95"
        onClick={leaveRoom}
      />
    </div>
  );
};

export default Bottom;
