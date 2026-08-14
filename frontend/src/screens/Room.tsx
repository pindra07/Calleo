import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";

export default function Room() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState<MediaStream>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} with socketId: ${id} joined the room`);
    setRemoteSocketId(id);
  }, []);

  const handleIncommingCall = useCallback(({from, offer}) => {
    console.log("handle Incoming Call function")
    console.log(`Incoming Call`, from, offer)
  })

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on('incomming:call', handleIncommingCall)
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall)
    };
  }, [socket, handleUserJoined, handleIncommingCall]);

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  const handleCallUser = useCallback(async () => {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", {
      to: remoteSocketId,
      offer,
    });
    setMyStream(stream);
  }, []);

  return (
    <>
      <h1>Room Screen</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <video
          ref={myVideoRef}
          autoPlay
          muted
          playsInline
          width="500"
          height="300"
        />
      )}
    </>
  );
}
