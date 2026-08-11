import { createContext, useContext, useMemo } from "react"
import { io } from "socket.io-client";

const SocketContext = createContext(null);

// custom useSocket Hook
export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}

export const SocketProvider = ({children}: {children: React.ReactNode}) => {

    const socket = useMemo(() => io('localhost:8000'), [])

    return <SocketContext value={socket}>
        {children}
    </SocketContext>
}