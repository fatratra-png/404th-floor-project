import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const ROUNDS = 8

function generateBinary(length: number): string {
  return Array.from({ length }, () => Math.random() > 0.5 ? '1' : '0').join('')
}

export default function Floor12() {
  const navigate = useNavigate()
  const [round, setRound] = useState(1)
  const [binary, setBinary] = useState(generateBinary(4))
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'play' | 'success' | 'fail' | 'complete'>('play')
  const [timeLeft, setTimeLeft] = useState(15)
  const [completed, setCompleted] = useState(false)

  const bitLength = Math.min(4 + round - 1, 8)

  const startRound = useCallback((r: number) => {
    const bits = Math.min(4 + r - 1, 8)
    setBinary(generateBinary(bits))
    setAnswer('')
    setPhase('play')
    setTimeLeft(Math.max(6, 15 - r))
  }, [])

  useEffect(() => {
    startRound(1)
  }, [])

  useEffect(() => {
    if (phase !== 'play') return
    if (timeLeft <= 0) {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => startRound(round), 1200)
      return
    }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, phase, round, startRound])

  const handleSubmit = useCallback(() => {
    if (phase !== 'play') return
    const decimal = parseInt(binary, 2)
    if (parseInt(answer, 10) === decimal) {
      setScore(prev => prev + 1)
      Sounds.play('mem_success')
      if (round >= ROUNDS) {
        setPhase('complete')
        setCompleted(true)
        markComplete(12)
        Sounds.play('victory')
        setTimeout(() => navigate('/floor/13'), 2500)
      } else {
        setPhase('success')
        setTimeout(() => {
          const nextRound = round + 1
          setRound(nextRound)
          startRound(nextRound)
        }, 1500)
      }
    } else {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => startRound(round), 1200)
    }
  }, [phase, binary, answer, round, startRound, navigate])

  return (
    <Layout floorNumber={12} title="Binary Decoder" subtitle="Binary to Decimal">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6">
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">BINARY DECODER</h1>
          <p className="text-slate-500 font-mono text-sm">
            Convert the binary value to decimal
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">ROUND <span className="text-primary">{round}</span>/{ROUNDS}</div>
          <div className="text-slate-500">SCORE <span className="text-green-400">{score}</span></div>
          <div className={`text-slate-500 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : ''}`}>
            TIME <span className={timeLeft <= 5 ? 'text-red-400' : 'text-yellow-400'}>{timeLeft}s</span>
          </div>
        </div>

        {/* Binary display */}
        <div className="flex gap-2">
          {binary.split('').map((bit, i) => (
              <div
                key={i}
                className={`w-10 md:w-14 h-14 md:h-20 rounded-lg border-2 flex items-center justify-center text-xl md:text-3xl font-mono font-bold transition-all ${
                  bit === '1' ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-600 text-slate-500'
                }`}
            >
              {bit}
            </div>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-600">
          {binary.split('').map((b, i) => (
            <span key={i} className="mx-1">{b === '1' ? 2 ** (binary.length - 1 - i) : 0}</span>
          )).reduce((acc, el, i, arr) => i < arr.length - 1 ? [acc, <span key={`plus-${i}`} className="text-slate-700 mx-1">+</span>, el] as any : acc, arr[0])}
          <span className="text-slate-500 ml-2">= ?</span>
        </div>

        <input
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value.replace(/\D/g, '').slice(0, 5))}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          className="w-40 bg-black/60 border border-slate-700 rounded-lg py-3 px-4 text-center font-mono text-2xl tracking-wider text-primary placeholder-slate-700 focus:border-primary focus:outline-none"
          placeholder="?"
          disabled={phase !== 'play'}
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={phase !== 'play' || answer === ''}
          className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30"
        >
          SUBMIT
        </button>

        {phase === 'success' && <div className="text-green-400 text-sm animate-pulse">✓ CORRECT!</div>}
        {phase === 'fail' && <div className="text-red-400 text-sm animate-pulse">✗ WRONG</div>}
        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ BINARY PROTOCOL DECODED</div>
        )}
        </div>
      </div>
    </Layout>
  )
}
