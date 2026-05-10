import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const SYMBOLS = ['◈', '◇', '◆', '○', '●', '□', '■', '△', '▲', '☆']
const TOTAL_PHASES = 3

export default function Floor19() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const [completed, setCompleted] = useState(false)

  // Phase 1: Symbol Cipher
  const [cipher, setCipher] = useState<{ symbol: string; value: number }[]>([])
  const [cipherTarget, setCipherTarget] = useState(0)
  const [cipherAnswer, setCipherAnswer] = useState('')
  const [cipherFails, setCipherFails] = useState(0)
  const [cipherShuffle, setCipherShuffle] = useState(0)

  // Phase 2: Logic Matrix
  const [matrix, setMatrix] = useState<boolean[][]>([])
  const [rowTargets, setRowTargets] = useState<number[]>([])
  const [colTargets, setColTargets] = useState<number[]>([])
  const [matrixMistakes, setMatrixMistakes] = useState(0)

  // Phase 3: Reflex Gauntlet
  const [reflexPhase, setReflexPhase] = useState<'ready' | 'waiting' | 'target' | 'hit'>('ready')
  const [reflexScore, setReflexScore] = useState(0)
  const [reflexTotal, setReflexTotal] = useState(0)
  const [reflexX, setReflexX] = useState(50)
  const [reflexY, setReflexY] = useState(50)
  const reflexTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reflexStartRef = useRef(0)

  const generateCipher = useCallback(() => {
    const shuffled = [...SYMBOLS].sort(() => Math.random() - 0.5).slice(0, 6)
    const mapping = shuffled.map((symbol, i) => ({ symbol, value: i + 1 }))
    setCipher(mapping)
    const a = Math.floor(Math.random() * 90) + 10
    const b = Math.floor(Math.random() * 90) + 10
    setCipherTarget(a + b)
    setCipherAnswer('')
    setCipherShuffle(0)
  }, [])

  const startPhase1 = useCallback(() => {
    generateCipher()
    const interval = setInterval(() => {
      setCipherShuffle(prev => {
        if (prev >= 2) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 6000)
  }, [generateCipher])

  useEffect(() => {
    if (phase === 0) startPhase1()
  }, [phase, startPhase1])

  useEffect(() => {
    if (cipherShuffle > 0 && cipherShuffle <= 2) {
      generateCipher()
    }
  }, [cipherShuffle, generateCipher])

  const decodeNumber = useCallback((n: number, mapping: { symbol: string; value: number }[]) => {
    const digits = String(n).split('').map(Number)
    return digits.map(d => mapping.find(m => m.value === d)?.symbol || '?').join('')
  }, [])

  const handleCipherSubmit = useCallback(() => {
    const userAnswer = parseInt(cipherAnswer, 10)
    if (userAnswer === cipherTarget) {
      Sounds.play('mem_success')
      setTimeout(() => setPhase(1), 800)
    } else {
      Sounds.play('mem_fail')
      setCipherFails(prev => prev + 1)
      setCipherAnswer('')
      generateCipher()
    }
  }, [cipherAnswer, cipherTarget, generateCipher])

  const generateMatrix = useCallback(() => {
    const size = 4
    const grid: boolean[][] = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.random() > 0.5)
    )
    const rTargets = grid.map(row => row.filter(Boolean).length)
    const cTargets = Array.from({ length: size }, (_, c) =>
      grid.reduce((sum, row) => sum + (row[c] ? 1 : 0), 0)
    )
    setMatrix(grid)
    setRowTargets(rTargets)
    setColTargets(cTargets)
    setMatrixMistakes(0)
  }, [])

  useEffect(() => {
    if (phase === 1) generateMatrix()
  }, [phase, generateMatrix])

  const toggleCell = useCallback((r: number, c: number) => {
    setMatrix(prev => {
      const next = prev.map(row => [...row])
      next[r][c] = !next[r][c]
      return next
    })
  }, [])

  const checkMatrix = useCallback(() => {
    const rowsOk = matrix.every((row, i) => row.filter(Boolean).length === rowTargets[i])
    const colsOk = colTargets.every((target, c) =>
      matrix.reduce((sum, row) => sum + (row[c] ? 1 : 0), 0) === target
    )
    if (rowsOk && colsOk) {
      Sounds.play('mem_success')
      setTimeout(() => setPhase(2), 800)
    } else {
      Sounds.play('mem_fail')
      setMatrixMistakes(prev => prev + 1)
    }
  }, [matrix, rowTargets, colTargets])

  const startReflexRound = useCallback(() => {
    setReflexPhase('waiting')
    setReflexX(Math.random() * 80 + 10)
    setReflexY(Math.random() * 60 + 15)

    const delay = 400 + Math.random() * 2000
    reflexTimerRef.current = setTimeout(() => {
      setReflexPhase('target')
      reflexStartRef.current = Date.now()
    }, delay)
  }, [])

  useEffect(() => {
    if (phase === 2) startReflexRound()
    return () => {
      if (reflexTimerRef.current) clearTimeout(reflexTimerRef.current)
    }
  }, [phase, startReflexRound])

  const handleReflexClick = useCallback(() => {
    if (reflexPhase === 'waiting') {
      Sounds.play('mem_fail')
      setReflexPhase('ready')
      if (reflexTimerRef.current) clearTimeout(reflexTimerRef.current)
      setTimeout(startReflexRound, 1000)
      return
    }
    if (reflexPhase !== 'target') return
    const reactionTime = Date.now() - reflexStartRef.current
    if (reactionTime <= 500) {
      Sounds.play('keyclick')
      setReflexScore(prev => prev + 1)
    } else {
      Sounds.play('mem_fail')
    }
    setReflexTotal(prev => prev + 1)
    setReflexPhase('hit')
    setTimeout(startReflexRound, 600)
  }, [reflexPhase, startReflexRound])

  useEffect(() => {
    if (reflexScore >= 7) {
      setCompleted(true)
      markComplete(19)
      Sounds.play('victory')
      setTimeout(() => navigate('/floor/20'), 3000)
    }
  }, [reflexScore, navigate])

  return (
    <Layout floorNumber={19} title="The Crucible" subtitle="Ultimate Trial">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6">
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 glitch-text" data-text="THE CRUCIBLE">THE CRUCIBLE</h1>
          <p className="text-slate-500 font-mono text-sm">No margin for error</p>
        </div>

        <div className="flex gap-3">
          {['CIPHER', 'MATRIX', 'REFLEX'].map((name, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              i < phase ? 'border-green-500 bg-green-500/10 text-green-400' :
              i === phase ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse' :
              'border-slate-700 bg-slate-800/50 text-slate-500'
            }`}>
              <span>{i < phase ? '✓' : i === phase ? '►' : `${i + 1}`}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>

        {phase === 0 && (
          <div className="flex flex-col items-center gap-4 max-w-md w-full">
            <h3 className="text-lg font-bold text-white">Phase 1: Symbol Cipher</h3>
            <p className="text-slate-400 text-sm font-mono">
              Decode the symbols and solve: {decodeNumber(Math.floor(cipherTarget / 10), cipher)} + {decodeNumber(cipherTarget % 10, cipher)} = ?
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              {cipher.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{m.symbol}</span>
                  <span className="text-[10px] font-mono text-slate-600">= {m.value}</span>
                </div>
              ))}
            </div>
            <div className="text-3xl font-mono text-primary font-bold">
              {decodeNumber(Math.floor(cipherTarget / 10), cipher)}
              <span className="text-slate-500 mx-2">+</span>
              {decodeNumber(cipherTarget % 10, cipher)}
              <span className="text-slate-500 mx-2">=</span>
              <span className="text-yellow-400">?</span>
            </div>
            <div className="text-sm text-slate-500">
              {Math.floor(cipherTarget / 10)} + {cipherTarget % 10} = <span className="text-yellow-400">{cipherTarget}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={cipherAnswer}
                onChange={e => setCipherAnswer(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCipherSubmit() }}
                className="w-32 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-center font-mono text-white focus:border-primary outline-none"
                placeholder="?"
              />
              <button
                onClick={handleCipherSubmit}
                disabled={!cipherAnswer}
                className="px-4 py-2 bg-primary hover:bg-blue-600 rounded text-white font-bold transition-all disabled:opacity-30"
              >
                SUBMIT
              </button>
            </div>
            {cipherFails > 0 && (
              <div className="text-red-500 text-xs font-mono">FAILURES: {cipherFails}</div>
            )}
            {cipherShuffle < 2 && (
              <div className="text-xs font-mono text-yellow-500 animate-pulse">CIPHER CHANGING SOON...</div>
            )}
          </div>
        )}

        {phase === 1 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-white">Phase 2: Logic Matrix</h3>
            <p className="text-slate-400 text-sm font-mono">Toggle cells to match row/column counts</p>
            <div className="flex gap-6 items-start">
              <div>
                <div className="grid grid-cols-4 gap-1.5">
                  {matrix.map((row, r) =>
                    row.map((cell, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => toggleCell(r, c)}
                        className={`w-10 h-10 rounded border transition-all ${
                          cell
                            ? 'bg-primary border-primary shadow-[0_0_8px_rgba(19,91,236,0.6)]'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        }`}
                      />
                    ))
                  )}
                </div>
                <div className="flex gap-1.5 mt-1.5 ml-0">
                  {colTargets.map((t, i) => (
                    <div key={i} className="w-10 text-center text-[10px] font-mono text-slate-500">{t}</div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {rowTargets.map((t, i) => (
                  <div key={i} className="h-10 flex items-center text-[10px] font-mono text-slate-500">{t}</div>
                ))}
              </div>
            </div>
            {matrixMistakes > 0 && (
              <div className="text-red-500 text-xs font-mono">MISTAKES: {matrixMistakes}</div>
            )}
            <button
              onClick={checkMatrix}
              className="px-6 py-2 bg-primary hover:bg-blue-600 rounded text-white font-bold transition-all"
            >
              VERIFY
            </button>
          </div>
        )}

        {phase === 2 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-white">Phase 3: Reflex Gauntlet</h3>
            <p className="text-slate-400 text-sm font-mono">
              {reflexPhase === 'ready' ? 'Get ready...' :
               reflexPhase === 'waiting' ? 'Wait for the target...' :
               reflexPhase === 'target' ? 'CLICK NOW!' :
               reflexPhase === 'hit' ? (reflexScore >= 7 ? 'COMPLETE!' : 'Next round...') : ''}
            </p>
            <div className="relative w-80 h-56 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
              {reflexPhase === 'target' && (
                <button
                  onClick={handleReflexClick}
                  className="absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-ping shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                  style={{ left: `${reflexX}%`, top: `${reflexY}%` }}
                />
              )}
              {reflexPhase !== 'target' && reflexPhase !== 'hit' && (
                <button
                  onClick={handleReflexClick}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-slate-600 text-sm font-mono">
                    {reflexPhase === 'ready' ? 'CLICK TO START' : 'WAIT...'}
                  </span>
                </button>
              )}
              {reflexPhase === 'hit' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={`text-lg font-bold font-mono ${reflexScore >= 7 ? 'text-green-400' : 'text-slate-500'}`}>
                    {reflexScore >= 7 ? '✓' : '--'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-6 text-sm font-mono text-slate-400">
              <span>HITS: <span className="text-green-400">{reflexScore}</span></span>
              <span>MISSES: <span className="text-red-400">{reflexTotal - reflexScore}</span></span>
            </div>
            <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-red-500 transition-all duration-200"
                style={{ width: `${(reflexScore / 7) * 100}%` }}
              />
            </div>
          </div>
        )}

        {completed && (
          <div className="text-green-400 text-xl font-mono animate-pulse">✓ CRUCIBLE CONQUERED</div>
        )}
        </div>
      </div>
    </Layout>
  )
}
