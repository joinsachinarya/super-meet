'use client'

import Image from 'next/image';
import Logo from '../public/logo.svg';
import Bg from '../public/bg.png';
import Heading from '../public/heading.svg';
import useHome from './views/home/use-home';
import { AnimatePresence, motion } from "motion/react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, SignIn } from '@clerk/nextjs';

export default function Home() {
  const { roomId, setRoomId, createAndJoin, joinRoom, showError, showSignInModal, setShowSignInModal } = useHome();


  return (
    <div className='relative'>
      <header className='h-[15vh] max-md:h-[10vh] max-md:px-[1vh] max-md:py-[3vh] px-[1vw] py-[1vw]' style={{ display: "flex", justifyContent: "space-between" }}>
        <Image src={Logo} alt='Logo' className='max-md:w-[16vh] max-md:h-[8vh] ' />

        <div className="my-auto">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="cursor-pointer px-4 py-2 mr-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="cursor-pointer px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonPopoverCard: "bg-white shadow-lg rounded-lg",
                  userButtonPopoverActionButton: "hover:bg-purple-50 text-gray-700"
                }
              }}
            />
          </SignedIn>
        </div>

      </header>
      <div className='flex flex-col items-center w-full h-[85vh] px-5'>
        <Image src={Heading} alt='Logo' className='justify-center items-center mt-20 max-md:pt-[10vh] ' />
        <h1 className='py-10'>Because Virtual Meetings Can Be Fun Too!</h1>
        <div className="flex flex-col items-center w-full">
          <AnimatePresence>
            {showError ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mb-2 px-6 py-3 rounded-lg bg-red-500 text-white font-medium shadow-lg"
              >
                Please provide a Room ID
              </motion.div>
            )
              : <div className='h-[56px]' />
            }
          </AnimatePresence>
          <div className="flex flex-row gap-1 mt-10">
            <input
              placeholder='Enter Room ID'
              value={roomId}
              onChange={(e) => setRoomId(e?.target?.value)}
              className='rounded-tl-xl rounded-bl-xl text-center'
              style={{
                background: "rgba(255, 255, 255, 0.21)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5.4px)",
              }}
            />
            <button onClick={joinRoom} className='cursor-pointer hover:opacity-80 p-3 bg-purple-600 rounded-tr-xl rounded-br-xl'>Join Room</button>
          </div>
        </div>

        <div className="group">
          <button className='cursor-pointer md:px-5 md:py-8 px-3 py-4 absolute right-10 bottom-0 md:bottom-9 rounded-full bg-purple-700 group-hover:bg-[#e513ec] h-[80px] w-[80px] md:h-auto md:w-auto border border-dashed border-[#e513ec] md:border-none'>
            <span className='hidden md:inline-block'>Create A <br></br>New Room</span>
            <span className='md:hidden font-medium'>New <br /> Room</span>
          </button>
          <button onClick={createAndJoin} className='cursor-pointer hidden md:block px-5 py-8 absolute right-12 bottom-10 rounded-full bg-[#e513ec] group-hover:bg-purple-700  uppercase font-mono font-extrabold text-white'
            style={{
              border: "2px solid white"
            }}
          >
            Create A <br></br>New Room
          </button>
        </div>

        {showSignInModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowSignInModal(false)}
              >
                ×
              </button>
              <SignIn afterSignInUrl={typeof window !== 'undefined' ? window.location.href : '/'} />
            </div>
          </div>
        )}

      </div>
      <div className='h-[100vh] w-screen absolute top-0 -z-10'>
        <Image src={Bg} alt='Menu' className='h-[100vh] w-screen object-cover' />
      </div>
    </div>
  );
}
