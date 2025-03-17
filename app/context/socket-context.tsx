import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";


const URL = process.env.NEXT_PUBLIC_DEPLOYMENT_ENV === "production" ? process.env.NEXT_PUBLIC_SOCKET_URL : "http://localhost:5000";
const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<any>(null);


    useEffect(() => {
        const connection = io(URL)
        console.log("connection", connection)
        setSocket(connection)
    }, [])

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}