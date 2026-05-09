import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const GRID_SIZE = 3
const MAX_ROUND = 8

export default function Floor13() {
  const navigate = useNavigate()
  const [pattern, setPattern] = useState<number[]>([])
  const [playerInput, setPlayerInput] = useState<number[]>([])
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<'show' | 'input' | 'success' | 'fail' | 'complete'>('show')
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startRound = useCallback((r: number) => {
    const len = Math.min(2 + r, 10)
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9))
    setPattern(seq)
    setPlayerInput([])
    setPhase('show')

    seq.forEach((cell, i) => {
      setTimeout(() => {
        setActiveCell(cell)
        const row = Math.floor(cell / 3)
        const col = cell % 3
        const freq = 400 + row * 100 + col * 50
        Sounds.play('keyclick')
        setTimeout(() => setActiveCell(null), 350)
      }, (i + 1) * 500)
    })

    timeoutRef.current = setTimeout(() => {
      setPhase('input')
    }, (seq.length + 1) * 500)
  }, [])

  useEffect(() => {
    startRound(1)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const handleCellClick = useCallback((idx: number) => {
    if (phase !== 'input') return
    const next = [...playerInput, idx]
    setPlayerInput(next)
    setActiveCell(idx)
    Sounds.play('mem_success')
    setTimeout(() => setActiveCell(null), 200)

    const pos = playerInput.length
    if (idx !== pattern[pos]) {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => {
        startRound(round)
      }, 1500)
      return
    }

    if (next.length === pattern.length) {
      setPhase('success')
      setScore(s => s + 1)
      Sounds.play('floor_complete')
      if (round >= MAX_ROUND) {
        setPhase('complete')
        setCompleted(true)
        markComplete(13)
        Sounds.play('victory')
        setTimeout(() => navigate('/floor/14'), 2500)
      } else {
        setTimeout(() => {
          const nr = round + 1
          setRound(nr)
          startRound(nr)
        }, 1500)
      }
    }
  }, [phase, playerInput, pattern, round, startRound, navigate])

  return (
    <Layout floorNumber={13} title="Reaction Matrix" subtitle="Pattern Memory">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">REACTION MATRIX</h1>
          <p className="text-slate-500 font-mono text-sm">
            {phase === 'show' ? 'Watch the pattern...' : 'Repeat the pattern'}
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">ROUND <span className="text-primary">{round}</span>/{MAX_ROUND}</div>
          <div className="text-slate-500">SCORE <span className="text-green-400">{score}</span></div>
          <div className="text-slate-500">LENGTH <span className="text-yellow-400">{pattern.length}</span></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, idx) => {
            const r = Math.floor(idx / 3)
            const c = idx % 3
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={phase !== 'input' && activeCell !== idx}
                className={`w-16 md:w-20 h-16 md:h-20 rounded-xl border-2 transition-all duration-150 ${
                  activeCell === idx
                    ? 'scale-110 border-white bg-primary/30 shadow-[0_0_30px_rgba(19,91,236,0.5)]'
                    : playerInput.includes(idx) && phase === 'input'
                      ? 'bg-primary/20 border-primary'
                      : phase === 'input'
                        ? 'border-slate-600 bg-slate-900/50 hover:border-primary hover:bg-slate-800 cursor-pointer'
                        : 'border-slate-700 bg-slate-900/30'
                }`}
              >
                <span className={`text-2xl ${activeCell === idx ? 'text-white' : 'text-slate-600'}`}>
                  {['◤', '▲', '◥', '◀', '◆', '▶', '◣', '▼', '◢'][idx]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Progress */}
        <div className="flex gap-1.5">
          {pattern.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx < playerInput.length ? 'bg-primary shadow-[0_0_6px_rgba(19,91,236,0.6)]' : 'bg-slate-700'
              } ${idx === playerInput.length && phase === 'input' ? 'animate-pulse' : ''}`}
            />
          ))}
        </div>

        {phase === 'success' && <div className="text-green-400 text-sm animate-pulse">✓ PATTERN MATCHED</div>}
        {phase === 'fail' && <div className="text-red-400 text-sm animate-pulse">✗ WRONG - RETRY</div>}
        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ REACTION MATRIX CALIBRATED</div>
        )}
      </div>
    </Layout>
  )
}
