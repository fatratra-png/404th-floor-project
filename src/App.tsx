import { Routes, Route, useParams, Navigate } from 'react-router-dom'
import ElevatorHub from './components/ElevatorHub'
import Victory from './floors/Victory'
import PuzzleLevel from './components/PuzzleLevel'

function FloorRouter() {
  const { id } = useParams<{ id: string }>()
  const num = parseInt(id || '', 10)

  if (num >= 1 && num <= 404) {
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
