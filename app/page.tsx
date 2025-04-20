'use client'

import Image from 'next/image';
import Logo from '../public/logo.svg';
import Bg from '../public/bg.png';
import Menu from '../public/menu.png';
import Heading from '../public/heading.svg';
import useHome from './views/home/use-home';

export default function Home() {
  const { roomId, setRoomId, createAndJoin, joinRoom } = useHome();


  return (
    <div className='relative'>
      <header className='h-[15vh] max-md:h-[10vh] max-md:px-[1vh] max-md:py-[3vh] px-[1vw] py-[1vw]' style={{ display: "flex", justifyContent: "space-between" }}>
        <Image src={Logo} alt='Logo' className='max-md:w-[16vh] max-md:h-[8vh] ' />
        <a href='https://github.com/joinsachinarya/SuperMeet'><Image src={Menu} alt='Menu' className='w-16 h-16 mr-4  rounded-full' /></a>
      </header>
      <div className='flex flex-col items-center w-full h-[85vh] px-5'>
        <Image src={Heading} alt='Logo' className='justify-center items-center mt-20 max-md:pt-[10vh] ' />
        <h1 className='py-10'>Because Virtual Meetings Can Be Fun Too!</h1>
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
          <button onClick={joinRoom} className='p-3 bg-purple-600 rounded-tr-xl rounded-br-xl'>Join Room</button>
        </div>

        <button className='px-5 py-8 absolute right-10 bottom-9 rounded-full bg-purple-700 '>Create a <br></br>new room</button>
        <button onClick={createAndJoin} className='px-5 py-8 absolute right-12 bottom-10 rounded-full bg-[#e513ec]  uppercase font-mono font-extrabold text-white'
          style={{
            border: "2px solid white"
          }}
        >Create a <br></br>new room</button>

      </div>
      <div className='h-[100vh] w-screen absolute top-0 -z-10'>
        <Image src={Bg} alt='Menu' className='h-[100vh] w-screen object-cover' />
      </div>
    </div>
  );
}
