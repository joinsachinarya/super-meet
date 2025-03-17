import React from 'react'
import { io } from "socket.io-client"

const Room = () => {
  const socket = io('http://localhost:5000/')

  socket.on("connect", () => {
    console.log("connected to server")
  })


  socket.on("disconnect", () => {
    console.log("Disconnected from Server!");
  });

  return (
    <div>Room</div>
  )
}

export default Room