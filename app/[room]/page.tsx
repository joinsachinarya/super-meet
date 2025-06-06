'use client'

import Player from "../component/Player";
import Bottom from "../component/Bottom";
import CopySection from "../component/CopySection";
import useRoom from "../views/room/use-room";
import { useState, useEffect } from "react";
import ChatOverlay from "../component/ChatOverlay";
import WhiteboardOverlay from "../component/WhiteboardOverlay";
import { useAuth, SignIn } from '@clerk/nextjs';

const Room: React.FC = () => {
    const { players, playerHighlighted, toggleScreenShare, screenShareActive, nonHighlightedPlayers, leaveRoom, toggleAudio, toggleVideo, roomId, socket, myId } = useRoom();
    const [chatActive, setChatActive] = useState(false);
    const [whiteboardActive, setWhiteboardActive] = useState(false);
    type Message = { user: string; text: string };
    type DrawEvent = { from: { x: number; y: number }; to: { x: number; y: number }; color: string };
    const [messages, setMessages] = useState<Message[]>([]);
    const [whiteboardEvents, setWhiteboardEvents] = useState<DrawEvent[]>([]);
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        };
        socket.on("chat-message", handleMessage);
        return () => {
            socket.off("chat-message", handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) return;
        const handleDraw = (ev: DrawEvent) => {
            setWhiteboardEvents((prev) => [...prev, ev]);
        };
        socket.on("whiteboard-draw", handleDraw);
        return () => {
            socket.off("whiteboard-draw", handleDraw);
        };
    }, [socket]);

    const handleSendMessage = (text: string) => {
        const msg: Message = { user: myId || "Me", text };
        setMessages((prev) => [...prev, msg]);
        if (socket) socket.emit("chat-message", roomId, msg);
    };

    const handleDraw = (ev: DrawEvent) => {
        setWhiteboardEvents((prev) => [...prev, ev]);
        if (socket) socket.emit("whiteboard-draw", roomId, ev);
    };

    const toggleChat = () => {
        setChatActive((prev) => !prev);
        if (!chatActive) setWhiteboardActive(false);
    };
    const toggleWhiteboard = () => {
        setWhiteboardActive((prev) => !prev);
        if (!whiteboardActive) setChatActive(false);
    };

    console.log('isSignedIn', isSignedIn);
    if (!isSignedIn) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-transparent  rounded-lg shadow-lg p-6 relative">
                    <SignIn afterSignInUrl={typeof window !== 'undefined' ? window.location.href : '/'} />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center px-2 md:px-8 pt-2 md:pt-8">
                {playerHighlighted ? (
                    <Player
                        url={playerHighlighted.url}
                        muted={playerHighlighted.muted}
                        playing={playerHighlighted.playing}
                        isActive
                    />
                ) : (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading stream...</div>
                )}
            </div>
            <div className="w-full flex flex-col md:flex-row items-center justify-center px-2 md:px-8">
                {Object.keys(nonHighlightedPlayers).map((playerId) => {
                    const { url, muted, playing } = nonHighlightedPlayers[playerId];
                    return (
                        <Player
                            key={playerId}
                            url={url}
                            muted={muted}
                            playing={playing}
                            isActive={false}
                        />
                    );
                })}
            </div>
            <CopySection roomId={roomId as string} />
            <Bottom
                muted={playerHighlighted?.muted || false}
                playing={playerHighlighted?.playing || false}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                leaveRoom={leaveRoom}
                toggleScreenShare={toggleScreenShare}
                screenShareActive={screenShareActive}
                toggleChat={toggleChat}
                chatActive={chatActive}
                toggleWhiteboard={toggleWhiteboard}
                whiteboardActive={whiteboardActive}
            />
            <div className="fixed right-5 left-5 md:left-auto bottom-24 flex justify-center z-50 pointer-events-none">
                {chatActive && (
                    <div className="pointer-events-auto">
                        <ChatOverlay
                            messages={messages}
                            onSend={handleSendMessage}
                            onClose={() => setChatActive(false)}
                        />
                    </div>
                )}
                {whiteboardActive && (
                    <div className="pointer-events-auto">
                        <WhiteboardOverlay
                            onDraw={handleDraw}
                            onClose={() => setWhiteboardActive(false)}
                            remoteDrawEvents={whiteboardEvents}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Room;
