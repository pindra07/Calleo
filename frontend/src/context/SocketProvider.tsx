import { createContext, useContext, useMemo } from "react"
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({children}: {children: React.ReactNode}) => {

    const socket = useMemo(() => {
        const socket = io("http://localhost:8000");
        return socket;
    }, [])

    //@ts-ignore
    return <SocketContext value={socket}>
        {children}
    </SocketContext>
}

// custom useSocket Hook
export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}
