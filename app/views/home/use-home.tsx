"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useHome = () => {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [copied, setCopied] = useState(false);
    const newRoomId = uuidv4();


    const createAndJoin = () => {
        router.push(`/${newRoomId}`);
    };

    const joinRoom = () => {
        if (roomId) {
            router.push(`/${roomId}`);
        } else {
            alert('Please provide a valid room id');
        }
    };

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }, [copied])
    return { roomId, setRoomId, copied, setCopied, newRoomId, createAndJoin, joinRoom }
}

export default useHome