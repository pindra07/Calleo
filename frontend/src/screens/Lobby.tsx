import { useState, useCallback } from "react";
import { useSocket } from "../context/SocketProvider";

export default function Lobby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket()

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault()
    //@ts-ignore
    socket.emit('room:join', {
      email, room
    })
    console.log({
      email, room
    })
  }, [email, room, socket])


  return (
    <>
      <div>
        <h1>Lobby</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="room">Room Number</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button>Join</button>
        </form>
      </div>
    </>
  );
}
