import { Routes, Route } from "react-router"
import Lobby from "./screens/Lobby"
import Room from "./screens/Room"

function App() {

  return (
    <>
      WebRTC: Video Calling application
      <Routes>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  )
}

export default App
