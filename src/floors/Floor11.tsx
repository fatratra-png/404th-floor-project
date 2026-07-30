import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'
import TechChallenge from '../components/TechChallenge'

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'

interface Gate {
  type: GateType
  inputs: [number, number]
  output: number
}

const ROUNDS = 5

function evalGate(g: Gate): number {
  const [a, b] = g.inputs
  switch (g.type) {
    case 'AND': return a & b
    case 'OR': return a | b
    case 'NOT': return a ^ 1
    case 'NAND': return (a & b) ^ 1
    case 'NOR': return (a | b) ^ 1
    case 'XOR': return a ^ b
  }
}

function generateRound(round: number) {
  const inputs: [number, number] = [Math.random() > 0.5 ? 1 : 0, Math.random() > 0.5 ? 1 : 0]
  const types: GateType[] = ['AND', 'OR', 'NAND', 'NOR', 'XOR']
  const selected = types.slice(0, Math.min(3 + round, types.length))
  const gates: Gate[] = selected.map(type => ({ type, inputs, output: 0 }))
  const targets = gates.map(g => evalGate({ ...g }))
  const userGates = gates.map((g, i) => ({
    type: g.type,
    inputs: g.inputs as [number, number],
    output: targets[i],
  }))
  return { inputs, types: selected, gates: userGates, targets }
}

export default function Floor11() {
  const navigate = useNavigate()
  const [showChallenge, setShowChallenge] = useState(false)
  const [round, setRound] = useState(1)
  const [roundData, setRoundData] = useState(() => generateRound(1))
  const [userTypes, setUserTypes] = useState<GateType[]>(roundData.types)
  const [phase, setPhase] = useState<'play' | 'success' | 'fail' | 'complete'>('play')
  const [completed, setCompleted] = useState(false)

  const resetRound = useCallback((r: number) => {
    const data = generateRound(r)
    setRoundData(data)
    setUserTypes(data.types)
    setPhase('play')
  }, [])

  const cycleGate = useCallback((idx: number) => {
    if (phase !== 'play') return
    setUserTypes(prev => {
      const next = [...prev]
      const all: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR']
      const currentIdx = all.indexOf(next[idx])
      next[idx] = all[(currentIdx + 1) % all.length]
      return next
    })
    Sounds.play('keyclick')
  }, [phase])

  const checkGates = useCallback(() => {
    if (phase !== 'play') return
    const correct = userTypes.every((t, i) => {
      const g = { type: t, inputs: roundData.inputs, output: 0 }
      return evalGate(g) === roundData.targets[i]
    })

    if (correct) {
      setPhase('success')
      Sounds.play('floor_complete')
      if (round >= ROUNDS) {
        setPhase('complete')
        setCompleted(true)
        Sounds.play('victory')
        setShowChallenge(true)
      } else {
        setTimeout(() => {
          const nextRound = round + 1
          setRound(nextRound)
          resetRound(nextRound)
        }, 1500)
      }
    } else {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => resetRound(round), 1200)
    }
  }, [phase, userTypes, roundData, round, resetRound, navigate])

  return (
    <Layout floorNumber={11} title="Logic Cascade" subtitle="Boolean Gates">
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">LOGIC CASCADE</h1>
          <p className="text-slate-500 font-mono text-sm">
            Set each gate so the output matches the target
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">ROUND <span className="text-primary">{round}</span>/{ROUNDS}</div>
          <div className="text-slate-500">
            INPUT: <span className="text-yellow-400">{roundData.inputs[0]} {roundData.inputs[1]}</span>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          {/* Inputs */}
          <div className="flex flex-col gap-2 items-center">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500 flex items-center justify-center font-mono font-bold text-yellow-400">{roundData.inputs[0]}</div>
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500 flex items-center justify-center font-mono font-bold text-yellow-400">{roundData.inputs[1]}</div>
          </div>

          <div className="flex gap-3">
            {roundData.types.map((_, idx) => {
              const gate: Gate = { type: userTypes[idx], inputs: roundData.inputs, output: 0 }
              const output = evalGate(gate)
              const target = roundData.targets[idx]
              const correct = output === target
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => cycleGate(idx)}
                    className={`w-20 h-16 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-all ${
                      phase === 'play' ? 'hover:border-primary cursor-pointer' : ''
                    } ${correct && phase === 'success' ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-slate-600 bg-slate-800 text-slate-300'}`}
                  >
                    {userTypes[idx]}
                  </button>
                  <div className="flex gap-1">
                    <div className="text-[10px] font-mono text-slate-600">IN:{roundData.inputs[0]}{roundData.inputs[1]}</div>
                  </div>
                  <div className="flex gap-2 text-xs font-mono">
                    <span className={output === 1 ? 'text-green-400' : 'text-red-400'}>OUT:{output}</span>
                    <span className="text-slate-600">TGT:{target}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={checkGates}
          disabled={phase !== 'play'}
          className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30"
        >
          VERIFY CIRCUIT
        </button>

        {phase === 'success' && <div className="text-green-400 text-sm animate-pulse">✓ CIRCUIT CORRECT!</div>}
        {phase === 'fail' && <div className="text-red-400 text-sm animate-pulse">✗ MISMATCH - RETRY</div>}
        {phase === 'complete' && !showChallenge && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ ALL GATES ALIGNED</div>
        )}
        </div>
      </div>
      {showChallenge && <TechChallenge floor={11} onComplete={() => { markComplete(11); navigate('/floor/12') }} />}
    </Layout>
  )
}
