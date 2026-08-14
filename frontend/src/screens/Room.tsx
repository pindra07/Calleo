import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";

export default function Room() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState<MediaStream>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const [remoteStream, setRemoteStream] = useState()

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} with socketId: ${id} joined the room`);
    setRemoteSocketId(id);
  }, []);


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
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(async ({from, offer}) => {
    setRemoteSocketId(from)
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream)
    const ans = await peer.getAnswer(offer)
    socket.emit('call:accepted', {to: from, ans})
    console.log(`Incoming Call`, from, offer)
  }, [socket])

  const handleCallAccepted = useCallback(({from, ans}) => {
    peer.setLocalDescription(ans)
    console.log("Call Accepted")
    for(const track of myStream.getTracks()) {
      peer.peer.addTrack(track,myStream)
    }
  }, [myStream])

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
    if(remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [myStream, remoteStream]);

  useEffect(() => {
    peer.peer.addEventListener('track', async event => {
      const remoteStream = event.streams
      setRemoteStream(remoteStream)
    })
  }, [])

  const handleNegoNeeded = useCallback( async () => {
      const offer = await peer.getOffer();
      socket.emit('peer:nego:needed', {offer, to: remoteSocketId})
  },[remoteSocketId, socket])

  useEffect(() => {
    peer.peer.addEvenetListener("negotiationneeded", handleNegoNeeded)
    return () => {
      peer.peer.removeEvenetListener("negotiationneeded", handleNegoNeeded) 
    }
  }, [handleNegoNeeded])

  const handleNegoNeedIncomming = () => {
    
  }

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on('incomming:call', handleIncommingCall)
    socket.on('call:accepted', handleCallAccepted)
    socket.on("peer:nego:needed", handleNegoNeedIncomming)
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall)
      socket.off("call:accepted", handleCallAccepted)
    };
  }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted]);

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
      {remoteStream && (
        <video
          ref={remoteVideoRef}
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
