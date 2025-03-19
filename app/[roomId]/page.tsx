'use client'

import React, { useEffect, useRef, useState } from 'react';
import RoomFooter from '../components/room-footer';
import { useRouter } from 'next/navigation';
import { User2Icon } from "lucide-react";

const Room = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleLeaveRoom = () => {
    router.push('/');
  }

  const handleAccessUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }

  useEffect(() => {
    handleAccessUserMedia();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {videoEnabled ? (
        <video
          id='video'
          className={`w-[calc(50%-1rem)] h-[calc(40%-1rem)]`}
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '1rem'
          }}
        />
      ) : (
        <div className='w-[calc(50%-1rem)] h-[calc(40%-1rem)] bg-gray-200 rounded-lg flex justify-center items-center'>
          <User2Icon size={50} className='h-full w-full' />
        </div>
      )}
      <RoomFooter
        muted={audioEnabled}
        playing={videoEnabled}
        toggleAudio={() => setAudioEnabled(!audioEnabled)}
        toggleVideo={() => setVideoEnabled(!videoEnabled)}
        leaveRoom={handleLeaveRoom}
      />
    </div>
  );
};

export default Room;
