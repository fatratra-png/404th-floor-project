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
import Floor9 from './floors/Floor9'
import Floor10 from './floors/Floor10'
import Floor11 from './floors/Floor11'
import Floor12 from './floors/Floor12'
import Floor13 from './floors/Floor13'
import Floor14 from './floors/Floor14'
import Floor15 from './floors/Floor15'
import Floor16 from './floors/Floor16'
import Floor17 from './floors/Floor17'
import Floor18 from './floors/Floor18'
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
      <Route path="/floor/9" element={<Floor9 />} />
      <Route path="/floor/10" element={<Floor10 />} />
      <Route path="/floor/11" element={<Floor11 />} />
      <Route path="/floor/12" element={<Floor12 />} />
      <Route path="/floor/13" element={<Floor13 />} />
      <Route path="/floor/14" element={<Floor14 />} />
      <Route path="/floor/15" element={<Floor15 />} />
      <Route path="/floor/16" element={<Floor16 />} />
      <Route path="/floor/17" element={<Floor17 />} />
      <Route path="/floor/18" element={<Floor18 />} />
      <Route path="/victory" element={<Victory />} />
    </Routes>
  )
}
