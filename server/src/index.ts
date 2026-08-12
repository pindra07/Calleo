import {Server} from "socket.io"

const io = new Server(8000, {
    // @ts-ignore
    cors: {
        origin: "http://localhost:5173"
    }
})

const emailToSocketIdMap = new Map()

io.on("connection", socket => {
    console.log(`Socket connected, Socket ID: `, socket.id)
    socket.on('room:join', (data) => {
        const {email, room} = data
    })
})

console.log("Socket Server")
