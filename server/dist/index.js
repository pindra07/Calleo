import { Server } from "socket.io";
const io = new Server(8000, {
    // @ts-ignore
    cors: {
        origin: "http://localhost:5173"
    }
});
io.on("connection", socket => {
    console.log(`Socket connected, Socket ID: `, socket.id);
    socket.on('room:join', (data) => {
        console.log(data);
    });
});
console.log("Socket Server");
//# sourceMappingURL=index.js.map