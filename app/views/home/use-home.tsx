"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from "motion/react";
import { useAuth, useSignIn } from '@clerk/nextjs';

const useHome = () => {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');
    const [copied, setCopied] = useState(false);
    const newRoomId = uuidv4();
    const [showError, setShowError] = useState(false);
    const [pendingAction, setPendingAction] = useState<null | { type: 'create' | 'join', roomId?: string }>(null);
    const { isSignedIn } = useAuth();
    const { signIn } = useSignIn();
    const [showSignInModal, setShowSignInModal] = useState(false);

    const createAndJoin = () => {
        if (isSignedIn) {
            router.push(`/${newRoomId}`);
        } else {
            setPendingAction({ type: 'create' });
            setShowSignInModal(true);
        }
    };

    const joinRoom = () => {
        if (roomId) {
            if (isSignedIn) {
                router.push(`/${roomId}`);
            } else {
                setPendingAction({ type: 'join', roomId });
                setShowSignInModal(true);
            }
        } else {
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
        }
    };

    useEffect(() => {
        if (isSignedIn && pendingAction) {
            if (pendingAction.type === 'create') {
                router.push(`/${newRoomId}`);
            } else if (pendingAction.type === 'join' && pendingAction.roomId) {
                router.push(`/${pendingAction.roomId}`);
            }
            setPendingAction(null);
        }
    }, [isSignedIn, pendingAction, newRoomId, router]);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        }
    }, [copied])

    const handleSetRoomId = (value: string) => {
        setRoomId(value.replace(/\s+/g, ""));
    };

    return { roomId, setRoomId: handleSetRoomId, copied, setCopied, newRoomId, createAndJoin, joinRoom, showError, showSignInModal, setShowSignInModal };
}

export default useHome