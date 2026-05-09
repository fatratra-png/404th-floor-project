import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308']
const COLOR_NAMES = ['red', 'blue', 'green', 'yellow']
const BASE_ROUNDS = 4
const MAX_ROUNDS = 12

export default function Floor5() {
  const navigate = useNavigate()
  const [sequence, setSequence] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<'show' | 'input' | 'success' | 'fail' | 'complete'>('show')
  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startRound = useCallback((r: number) => {
    const len = Math.min(BASE_ROUNDS + r - 1, MAX_ROUNDS)
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 4))
    setSequence(seq)
    setPlayerInput([])
    setPhase('show')

    seq.forEach((colorIdx, i) => {
      setTimeout(() => {
        setActiveColor(colorIdx)
        Sounds.play('keyclick')
        setTimeout(() => setActiveColor(null), 300)
      }, (i + 1) * 600)
    })

    timeoutRef.current = setTimeout(() => {
      setPhase('input')
    }, (seq.length + 1) * 600)
  }, [])

  useEffect(() => {
    startRound(1)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleColorPress = useCallback((idx: number) => {
    if (phase !== 'input') return

    const nextInput = [...playerInput, idx]
    setPlayerInput(nextInput)
    setActiveColor(idx)
    Sounds.play('mem_success')
    setTimeout(() => setActiveColor(null), 200)

    // Check if correct
    const pos = playerInput.length
    if (idx !== sequence[pos]) {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => {
        if (round > 1) setRound(r => r - 1)
        startRound(round)
      }, 1500)
      return
    }

    // Check if round complete
    if (nextInput.length === sequence.length) {
      setPhase('success')
      setScore(s => s + 1)
      Sounds.play('floor_complete')

      if (round >= 8) {
        setPhase('complete')
        markComplete(5)
        setTimeout(() => navigate('/floor/6'), 2500)
      } else {
        setTimeout(() => {
          const nextRound = round + 1
          setRound(nextRound)
          startRound(nextRound)
        }, 1500)
      }
    }
  }, [phase, playerInput, sequence, round, startRound, navigate])

  return (
    <Layout floorNumber={5} title="Memory Core" subtitle="Sequence Lock">
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 bg-[#080b0f]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">MEMORY MATRIX</h1>
          <p className="text-slate-500 font-mono text-sm">
            {phase === 'show' && 'Watch the sequence...'}
            {phase === 'input' && `Round ${round}/8 - Repeat the pattern`}
            {phase === 'success' && '✓ Correct!'}
            {phase === 'fail' && '✗ Wrong! Retry...'}
            {phase === 'complete' && '✓ MEMORY CORE UNLOCKED'}
          </p>
        </div>

        {/* Score / Round */}
        <div className="flex gap-8 text-sm font-mono">
          <div className="text-slate-500">ROUND <span className="text-primary">{round}</span>/8</div>
          <div className="text-slate-500">SCORE <span className="text-green-400">{score}</span></div>
          <div className="text-slate-500">LENGTH <span className="text-yellow-400">{sequence.length}</span></div>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-2 gap-4">
          {COLORS.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleColorPress(idx)}
              disabled={phase !== 'input'}
              className={`w-32 h-32 rounded-2xl transition-all duration-150 border-2 ${
                activeColor === idx
                  ? 'scale-110 border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                  : phase === 'input'
                    ? 'hover:scale-105 border-transparent cursor-pointer'
                    : 'border-transparent'
              } ${phase !== 'input' && activeColor !== idx ? 'opacity-60' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Sequence indicator */}
        <div className="flex gap-1.5">
          {sequence.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx < playerInput.length
                  ? 'bg-primary shadow-[0_0_6px_rgba(19,91,236,0.6)]'
                  : 'bg-slate-700'
              } ${idx === playerInput.length && phase === 'input' ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">
            MEMORY CORE STABILIZED - PROCEEDING...
          </div>
        )}
      </div>
    </Layout>
  )
}
