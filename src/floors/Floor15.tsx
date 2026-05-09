import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const DIALS = 4
const POSITIONS = 8
const MAX_GUESSES = 12

function generateCode(): number[] {
  return Array.from({ length: DIALS }, () => Math.floor(Math.random() * POSITIONS))
}

function checkGuess(code: number[], guess: number[]): { correct: number; close: number } {
  let correct = 0
  let close = 0
  const codeUsed = code.map(() => false)
  const guessUsed = guess.map(() => false)

  for (let i = 0; i < DIALS; i++) {
    if (guess[i] === code[i]) {
      correct++
      codeUsed[i] = true
      guessUsed[i] = true
    }
  }

  for (let i = 0; i < DIALS; i++) {
    if (guessUsed[i]) continue
    for (let j = 0; j < DIALS; j++) {
      if (codeUsed[j]) continue
      if (guess[i] === code[j]) {
        close++
        codeUsed[j] = true
        guessUsed[i] = true
        break
      }
    }
  }

  return { correct, close }
}

export default function Floor15() {
  const navigate = useNavigate()
  const [code] = useState(generateCode)
  const [guess, setGuess] = useState<number[]>(Array(DIALS).fill(0))
  const [attempts, setAttempts] = useState<{ guess: number[]; correct: number; close: number }[]>([])
  const [completed, setCompleted] = useState(false)
  const [phase, setPhase] = useState<'play' | 'complete'>('play')

  const rotate = useCallback((idx: number, dir: number) => {
    if (completed) return
    setGuess(prev => {
      const next = [...prev]
      next[idx] = (next[idx] + dir + POSITIONS) % POSITIONS
      return next
    })
    Sounds.play('keyclick')
  }, [completed])

  const submitGuess = useCallback(() => {
    if (completed) return
    const result = checkGuess(code, guess)
    setAttempts(prev => [...prev, { guess: [...guess], ...result }])

    if (result.correct === DIALS) {
      setCompleted(true)
      setPhase('complete')
      markComplete(15)
      Sounds.play('victory')
      setTimeout(() => navigate('/floor/16'), 2500)
    } else {
      Sounds.play('mem_fail')
      if (attempts.length + 1 >= MAX_GUESSES) {
        setPhase('complete')
        setCompleted(true)
        markComplete(15)
        Sounds.play('victory')
        setTimeout(() => navigate('/floor/16'), 2500)
      }
    }
  }, [code, guess, completed, attempts.length, navigate])

  return (
    <Layout floorNumber={15} title="Cipher Lock" subtitle="Combination Puzzle">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">CIPHER LOCK</h1>
          <p className="text-slate-500 font-mono text-sm">
            Crack the {DIALS}-digit code ({MAX_GUESSES} guesses)
          </p>
        </div>

        <div className="text-sm font-mono text-slate-500">
          GUESSES: <span className={attempts.length >= MAX_GUESSES - 3 ? 'text-red-400' : 'text-yellow-400'}>{attempts.length}/{MAX_GUESSES}</span>
        </div>

        {/* Dials */}
        <div className="flex gap-4">
          {guess.map((val, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button
                onClick={() => rotate(i, 1)}
                disabled={completed}
                className="text-slate-400 hover:text-primary cursor-pointer disabled:opacity-30"
              >
                ▲
              </button>
              <div className="w-12 md:w-16 h-16 md:h-20 rounded-xl border-2 border-slate-600 bg-slate-900 flex items-center justify-center text-2xl md:text-3xl font-mono font-bold text-primary">
                {val}
              </div>
              <button
                onClick={() => rotate(i, -1)}
                disabled={completed}
                className="text-slate-400 hover:text-primary cursor-pointer disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={submitGuess}
          disabled={completed}
          className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30"
        >
          SUBMIT CODE
        </button>

        {/* History */}
        <div className="w-full max-w-sm max-h-40 overflow-y-auto">
          {attempts.map((a, i) => (
            <div key={i} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-800">
              <span className="text-slate-500">#{i + 1}</span>
              <span className="text-slate-300">{a.guess.join(' ')}</span>
              <span>
                <span className="text-green-400">{a.correct}✓</span>
                <span className="text-yellow-400 ml-1">{a.close}○</span>
              </span>
            </div>
          ))}
        </div>

        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ CIPHER LOCK DISENGAGED</div>
        )}
      </div>
    </Layout>
  )
}
