import { Server } from "socket.io";
const io = new Server(8000, {
    // @ts-ignore
    cors: {
        origin: "http://localhost:5173"
    }
});
const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
io.on("connection", socket => {
    console.log(`Socket connected, Socket ID: `, socket.id);
    socket.on('room:join', (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketIdToEmailMap.set(socket.id, email);
        io.to(room).emit('user:joined', { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });
});
console.log("Socket Server");
//# sourceMappingURL=index.js.map