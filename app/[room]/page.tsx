"use client"
import React, { useState, useEffect, useRef } from "react";
import Player from "../component/Player";
import { cloneDeep } from "lodash";
import Bottom from "../component/Bottom";
import CopySection from "../component/CopySection";
import { useRouter, usePathname } from "next/navigation";
import Peer from "peerjs";
import { io } from "socket.io-client";

interface PlayerStream {
    url: MediaStream;
    muted: boolean;
    playing: boolean;
}

interface Players {
    [userId: string]: PlayerStream;
}

const Room: React.FC = () => {
    const [socket, setSocket] = useState<any>(null);
    // const URL = 'http://localhost:5000'
    const URL = 'https://super-meet-backend.onrender.com'

    useEffect(() => {
        const connection = io(URL);
        console.log("socket connection", connection)
        setSocket(connection);
    }, []);

    const router = useRouter();
    const pathname = usePathname();
    const roomId = pathname.split('/')[1];

    const [players, setPlayers] = useState<Players>({});
    const [stateStream, setStateStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [myId, setMyId] = useState<string>("");
    const [users, setUsers] = useState<{ [userId: string]: any }>({});

    const isStreamSet = useRef(false);
    const isPeerSet = useRef(false);

    useEffect(() => {
        if (isStreamSet.current) return;
        isStreamSet.current = true;
        const initStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });
                console.log("Setting your stream");
                setStateStream(stream);
            } catch (e) {
                console.error("Error in media navigator", e);
            }
        };
        initStream();
    }, []);

    useEffect(() => {
        if (isPeerSet.current || !roomId || !socket) return;
        isPeerSet.current = true;
        const initPeer = async () => {
            try {
                const { default: PeerLib } = await import("peerjs");
                const myPeer = new PeerLib();
                setPeer(myPeer);
                myPeer.on("open", (id: string) => {
                    console.log(`Your peer id is ${id}`);
                    setMyId(id);
                    socket.emit("join-room", roomId, id);
                });
            } catch (error) {
                console.error("Error initializing peer:", error);
            }
        };
        initPeer();
    }, [roomId, socket]);

    const localStream = stateStream;

    useEffect(() => {
        if (!socket || !peer || !localStream) return;
        const handleUserConnected = (newUserId: string) => {
            console.log(`User connected in room with userId ${newUserId}`);
            try {
                const call = peer.call(newUserId, localStream);
                call.on("stream", (incomingStream: MediaStream) => {
                    console.log(`Incoming stream from ${newUserId}`);
                    setPlayers((prev) => ({
                        ...prev,
                        [newUserId]: {
                            url: incomingStream,
                            muted: true,
                            playing: true,
                        },
                    }));
                    setUsers((prev) => ({
                        ...prev,
                        [newUserId]: call,
                    }));
                });
            } catch (error) {
                console.error("Error calling new user:", error);
            }
        };
        socket.on("user-connected", handleUserConnected);
        return () => {
            socket.off("user-connected", handleUserConnected);
        };
    }, [peer, socket, localStream]);

    useEffect(() => {
        if (!socket) return;
        const handleToggleAudio = (userId: string) => {
            console.log(`User with id ${userId} toggled audio`);
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                if (copy[userId]) {
                    copy[userId].muted = !copy[userId].muted;
                }
                return { ...copy };
            });
        };

        const handleToggleVideo = (userId: string) => {
            console.log(`User with id ${userId} toggled video`);
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                if (copy[userId]) {
                    copy[userId].playing = !copy[userId].playing;
                }
                return { ...copy };
            });
        };

        const handleUserDisconnected = (userId: string) => {
            console.log(`User ${userId} disconnected from the room`);
            if (users[userId]) {
                users[userId].close();
            }
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                delete copy[userId];
                return { ...copy };
            });
        };

        socket.on("toggle-audio", handleToggleAudio);
        socket.on("toggle-video", handleToggleVideo);
        socket.on("user-disconnected", handleUserDisconnected);

        return () => {
            socket.off("toggle-audio", handleToggleAudio);
            socket.off("toggle-video", handleToggleVideo);
            socket.off("user-disconnected", handleUserDisconnected);
        };
    }, [socket, users]);

    useEffect(() => {
        if (!peer || !localStream) return;
        const handleCall = (call: any) => {
            const callerId = call.peer;
            try {
                call.answer(localStream);
                call.on("stream", (incomingStream: MediaStream) => {
                    console.log(`Incoming stream from ${callerId}`);
                    setPlayers((prev) => ({
                        ...prev,
                        [callerId]: {
                            url: localStream,
                            muted: true,
                            playing: true,
                        },
                    }));

                    setUsers((prev) => ({
                        ...prev,
                        [callerId]: call,
                    }));
                });
            } catch (error) {
                console.error(`Error handling call from ${callerId}:`, error);
            }
        };

        peer.on("call", handleCall);
        return () => {
            peer.off("call", handleCall);
        };
    }, [peer, localStream]);

    useEffect(() => {
        if (!localStream || !myId) return;
        console.log(`Setting local stream for ${myId}`);
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: localStream,
                muted: true,
                playing: true,
            },
        }));
    }, [myId, localStream]);

    const leaveRoom = () => {
        try {
            socket.emit("leave", roomId, myId);
            console.log("Leaving room", roomId);
            if (peer) {
                peer.disconnect();
            }
            router.push("/");
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    const toggleAudio = () => {
        try {
            console.log("I toggled my audio");
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                if (copy[myId]) {
                    copy[myId].muted = !copy[myId].muted;
                }
                return { ...copy };
            });
            socket.emit("toggle-audio", roomId, myId);
        } catch (error) {
            console.error("Error toggling audio:", error);
        }
    };

    const toggleVideo = () => {
        try {
            console.log("I toggled my video");
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                if (copy[myId]) {
                    copy[myId].playing = !copy[myId].playing;
                }
                return { ...copy };
            });
            socket.emit("toggle-video", roomId, myId);
        } catch (error) {
            console.error("Error toggling video:", error);
        }
    };

    const playersCopy = cloneDeep(players);
    const playerHighlighted = playersCopy[myId];
    delete playersCopy[myId];
    const nonHighlightedPlayers = playersCopy;
    return (
        <>
            <div className="w-full h-full">
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
            <div className="w-full h-full">
                {Object.keys(nonHighlightedPlayers).map((playerId) => {
                    const { url, muted, playing } = nonHighlightedPlayers[playerId];
                    console.log("url", url, muted, playing);
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
            />
        </>
    );
};

export default Room;
