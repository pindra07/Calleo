import { Server } from "socket.io";
const io = new Server(8000);
io.on("connection", socket => {
    console.log(`Socket connected`, socket.id);
});
console.log("Socket Server");
//# sourceMappingURL=index.js.map