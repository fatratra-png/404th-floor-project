import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const ROUNDS = 5

function shuffleArray(arr: number[]): number[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Floor16() {
  const navigate = useNavigate()
  const [round, setRound] = useState(1)
  const [numbers, setNumbers] = useState<number[]>(() => shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]))
  const [nextToClick, setNextToClick] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [roundTime, setRoundTime] = useState(0)
  const [results, setResults] = useState<number[]>([])
  const [phase, setPhase] = useState<'play' | 'success' | 'fail' | 'complete'>('play')
  const [completed, setCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const activeRef = useRef(true)

  const startRound = useCallback((r: number) => {
    const count = Math.min(4 + r, 9)
    const nums = Array.from({ length: count }, (_, i) => i + 1)
    setNumbers(shuffleArray(nums))
    setNextToClick(1)
    setPhase('play')
    setStartTime(null)
    setTimeLeft(0)
  }, [])

  useEffect(() => {
    startRound(1)
  }, [])

  const handleClick = useCallback((num: number) => {
    if (phase !== 'play') return

    if (startTime === null) {
      setStartTime(Date.now())
    }

    if (num === nextToClick) {
      Sounds.play('keyclick')
      if (nextToClick === numbers.length) {
        const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
        setRoundTime(elapsed)
        setResults(prev => [...prev, elapsed])
        Sounds.play('mem_success')

        if (round >= ROUNDS) {
          setPhase('complete')
          setCompleted(true)
          markComplete(16)
          Sounds.play('victory')
          setTimeout(() => navigate('/floor/17'), 2500)
        } else {
          setPhase('success')
          setTimeout(() => {
            const nr = round + 1
            setRound(nr)
            startRound(nr)
          }, 1500)
        }
      } else {
        setNextToClick(prev => prev + 1)
      }
    } else {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => startRound(round), 1200)
    }
  }, [phase, nextToClick, numbers, round, startTime, startRound, navigate])

  return (
    <Layout floorNumber={16} title="EM Pulse" subtitle="Rapid Sequencing">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">EM PULSE SEQUENCER</h1>
          <p className="text-slate-500 font-mono text-sm">
            Click numbers in ascending order as fast as possible
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">ROUND <span className="text-primary">{round}</span>/{ROUNDS}</div>
          <div className="text-slate-500">NEXT <span className="text-yellow-400">{nextToClick}</span></div>
          {roundTime > 0 && <div className="text-slate-500">TIME <span className="text-green-400">{roundTime.toFixed(2)}s</span></div>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {numbers.map(num => {
            const clicked = num < nextToClick
            return (
              <button
                key={num}
                onClick={() => handleClick(num)}
                disabled={phase !== 'play' || clicked}
                className={`w-12 md:w-16 h-12 md:h-16 rounded-xl border-2 text-base md:text-xl font-bold font-mono transition-all ${
                  clicked
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : phase === 'play'
                      ? 'border-slate-600 bg-slate-900 text-slate-300 hover:border-primary hover:bg-slate-800 cursor-pointer'
                      : 'border-slate-700 bg-slate-900/50 text-slate-500'
                }`}
              >
                {num}
              </button>
            )
          })}
        </div>

        {phase === 'fail' && <div className="text-red-400 text-sm animate-pulse">✗ WRONG ORDER!</div>}
        {phase === 'success' && <div className="text-green-400 text-sm animate-pulse">✓ SEQUENCE COMPLETE</div>}

        {/* Results */}
        {results.length > 0 && (
          <div className="flex gap-2 text-xs font-mono">
            {results.map((t, i) => (
              <div key={i} className={`px-2 py-1 rounded ${t < 3 ? 'bg-green-500/20 text-green-400' : t < 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                R{i + 1}: {t.toFixed(2)}s
              </div>
            ))}
          </div>
        )}

        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ EM PULSE CALIBRATED</div>
        )}
      </div>
    </Layout>
  )
}
