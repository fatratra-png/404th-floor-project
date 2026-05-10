import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import type { ComponentType } from 'react'
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
import Floor19 from './floors/Floor19'
import Floor20 from './floors/Floor20'
import Victory from './floors/Victory'
import PuzzleLevel from './components/PuzzleLevel'

const floorComponents: Record<number, ComponentType> = {
  1: Floor1, 2: Floor2, 3: Floor3, 4: Floor4, 5: Floor5,
  6: Floor6, 7: Floor7, 8: Floor8, 9: Floor9, 10: Floor10,
  11: Floor11, 12: Floor12, 13: Floor13, 14: Floor14, 15: Floor15,
  16: Floor16, 17: Floor17, 18: Floor18, 19: Floor19, 20: Floor20,
}

function FloorRouter() {
  const { id } = useParams<{ id: string }>()
  const num = parseInt(id || '', 10)

  if (num >= 1 && num <= 20) {
    const Component = floorComponents[num]
    return <Component />
  }

  if (num >= 21 && num <= 404) {
    return <PuzzleLevel floorNumber={num} />
  }

  return <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ElevatorHub />} />
      <Route path="/floor/:id" element={<FloorRouter />} />
      <Route path="/victory" element={<Victory />} />
    </Routes>
  )
}
