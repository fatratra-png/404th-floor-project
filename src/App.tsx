import { Routes, Route } from 'react-router-dom'
import ElevatorHub from './components/ElevatorHub'
import Floor1 from './floors/Floor1'
import Floor2 from './floors/Floor2'
import Floor3 from './floors/Floor3'
import Floor4 from './floors/Floor4'
import Floor5 from './floors/Floor5'
import Floor6 from './floors/Floor6'
import Floor7 from './floors/Floor7'
import Floor8 from './floors/Floor8'
import Victory from './floors/Victory'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ElevatorHub />} />
      <Route path="/floor/1" element={<Floor1 />} />
      <Route path="/floor/2" element={<Floor2 />} />
      <Route path="/floor/3" element={<Floor3 />} />
      <Route path="/floor/4" element={<Floor4 />} />
      <Route path="/floor/5" element={<Floor5 />} />
      <Route path="/floor/6" element={<Floor6 />} />
      <Route path="/floor/7" element={<Floor7 />} />
      <Route path="/floor/8" element={<Floor8 />} />
      <Route path="/victory" element={<Victory />} />
    </Routes>
  )
}
