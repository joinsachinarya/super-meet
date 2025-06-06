'use client'

import { cloneDeep } from 'lodash';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Peer from 'peerjs';
import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';



interface PlayerStream {
    url: MediaStream;
    muted: boolean;
    playing: boolean;
}

interface Players {
    [userId: string]: PlayerStream;
}



const useRoom = () => {
    const [socket, setSocket] = useState<any>(null);
    const URL = 'https://super-meet-backend.onrender.com'


    useEffect(() => {
        const connection = io(URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
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
    const [screenShareActive, setScreenShareActive] = useState(false);
    const [originalStream, setOriginalStream] = useState<MediaStream | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenSharer, setScreenSharer] = useState<string | null>(null);

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

    useEffect(() => {
        if (!socket) return;
        // Listen for screen share events from others
        const handleScreenShareStarted = (userId: string) => {
            setScreenSharer(userId);
            if (userId !== myId) {
                setScreenShareActive(false);
            }
        };
        const handleScreenShareStopped = () => {
            setScreenSharer(null);
        };
        socket.on("screen-share-started", handleScreenShareStarted);
        socket.on("screen-share-stopped", handleScreenShareStopped);
        return () => {
            socket.off("screen-share-started", handleScreenShareStarted);
            socket.off("screen-share-stopped", handleScreenShareStopped);
        };
    }, [socket, myId]);

    const leaveRoom = () => {
        try {
            socket.emit("leave", roomId, myId);
            console.log("Leaving room", roomId);
            if (peer) {
                peer.disconnect();
            }
            // Stop all media tracks
            if (stateStream) {
                stateStream.getTracks().forEach(track => track.stop());
            }
            if (originalStream) {
                originalStream.getTracks().forEach(track => track.stop());
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

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            // Start screen sharing
            if (screenSharer && screenSharer !== myId) {
                alert("Someone else is already sharing their screen.");
                return;
            }
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                setOriginalStream(stateStream);
                setStateStream(displayStream);
                setScreenShareActive(true);
                setIsScreenSharing(true);
                socket.emit("screen-share-started", roomId, myId);
                // Listen for when the user stops sharing from browser UI
                displayStream.getVideoTracks()[0].onended = () => {
                    stopScreenShare();
                };
            } catch (err) {
                console.error("Error starting screen share", err);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = () => {
        if (originalStream) {
            setStateStream(originalStream);
        }
        setScreenShareActive(false);
        setIsScreenSharing(false);
        setScreenSharer(null);
        socket.emit("screen-share-stopped", roomId, myId);
    };

    const playersCopy = cloneDeep(players);
    const playerHighlighted = playersCopy[myId];
    delete playersCopy[myId];
    const nonHighlightedPlayers = playersCopy;
    return {
        players,
        playerHighlighted,
        nonHighlightedPlayers,
        leaveRoom,
        toggleAudio,
        toggleVideo,
        roomId,
        toggleScreenShare,
        screenShareActive,
        isScreenSharing,
        screenSharer,
        socket,
        myId,
    }
}

export default useRoom