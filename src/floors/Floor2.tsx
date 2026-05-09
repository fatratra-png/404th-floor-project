import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const VALID_ID = '8492'

export default function Floor2() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'ready' | 'granted' | 'denied'>('ready')
  const [diagnostic, setDiagnostic] = useState(false)

  const handleComplete = useCallback(() => {
    markComplete(2)
    Sounds.play('floor_complete')
    setTimeout(() => navigate('/floor/3'), 2500)
  }, [navigate])

  const handleSubmit = useCallback(() => {
    if (input === VALID_ID) {
      setStatus('granted')
      Sounds.play('elevator_rise')
      setTimeout(handleComplete, 2000)
    } else {
      setStatus('denied')
      Sounds.play('elevator_fall')
      setTimeout(() => setStatus('ready'), 2500)
    }
  }, [input, handleComplete])

  const handleKeypad = useCallback((value: string) => {
    if (status === 'granted') return
    if (value === 'backspace') {
      setInput(prev => prev.slice(0, -1))
      Sounds.play('keyclick')
    } else if (value === 'enter') {
      handleSubmit()
    } else if (/^\d$/.test(value) && input.length < 4) {
      setInput(prev => prev + value)
      Sounds.play('keyclick')
    }
  }, [input.length, status, handleSubmit])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (status === 'granted') return
      if (e.key === 'Enter') handleSubmit()
      else if (e.key === 'Backspace') handleKeypad('backspace')
      else if (/^[0-9]$/.test(e.key)) handleKeypad(e.key)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleKeypad, handleSubmit, status])

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['backspace', '0', 'enter'],
  ]

  return (
    <Layout floorNumber={2} title="Access Terminal" subtitle="Keypad Entry">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        <div className="absolute inset-0 bg-black/30" />

        {/* Sticky Note Clue */}
        <div
          className={`absolute top-[15%] right-[10%] z-30 transition-all duration-500 ${
            diagnostic ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <div className="w-28 h-28 bg-yellow-200/90 shadow-lg rounded-sm p-2 flex flex-col items-center justify-center rotate-3">
            <p className="text-[10px] font-bold uppercase border-b border-slate-800/20 w-full text-center pb-1 mb-1 text-slate-800">Reminder</p>
            <p className="text-xs font-mono font-bold text-slate-800 text-center">Update ID:<br /><span className="blur-none">{VALID_ID}</span></p>
            <p className="text-[8px] mt-1 opacity-60 text-slate-800">Don't forget!</p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-primary/30 bg-surface/80 backdrop-blur">
          <div className="bg-surface/80 border-b border-slate-700/50 p-3 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span className="text-[9px] font-bold tracking-[0.18em] text-slate-300">SYSTEM LOCKDOWN</span>
            </div>
            <div className="font-mono text-[9px] text-primary/80">TERMINAL_ID: #404-B2</div>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold text-primary tracking-widest uppercase">Enter Technician ID</label>
              <div className="relative">
                <input
                  value={status === 'granted' ? 'ACCESS_GRANTED' : status === 'denied' ? 'ACCESS_DENIED' : input}
                  readOnly
                  className={`w-full bg-black/40 border rounded-lg py-3 px-3 text-center font-mono text-xl tracking-[0.45em] placeholder-slate-700 transition-all uppercase ${
                    status === 'granted' ? 'border-green-500 text-green-500' :
                    status === 'denied' ? 'border-red-500 text-red-500' :
                    'border-slate-700 text-primary'
                  }`}
                  placeholder="_ _ _ _"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                  <span className="material-symbols-outlined text-lg">
                    {status === 'granted' ? 'lock_open' : 'lock'}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {keys.flat().map(key => (
                <button
                  key={key}
                  onClick={() => handleKeypad(key)}
                  className={`aspect-[4/3] rounded-lg flex items-center justify-center font-bold text-lg active:scale-95 transition-all ${
                    key === 'backspace'
                      ? 'bg-surface border border-red-900/30 hover:bg-red-900/20 text-red-400'
                      : key === 'enter'
                        ? 'bg-primary border border-primary shadow-[0_0_15px_rgba(19,91,236,0.4)] text-white'
                        : 'bg-surface border border-slate-700/50 hover:bg-surface-highlight hover:border-primary/50 text-white'
                  }`}
                >
                  {key === 'backspace' ? (
                    <span className="material-symbols-outlined text-lg">backspace</span>
                  ) : key === 'enter' ? (
                    <span className="material-symbols-outlined">keyboard_return</span>
                  ) : (
                    <span>{key}</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setDiagnostic(!diagnostic)
                if (!diagnostic) {
                  Sounds.play('keyclick')
                }
              }}
              className={`w-full py-3 font-bold rounded-lg border flex items-center justify-center gap-2 transition-all text-sm ${
                diagnostic
                  ? 'bg-yellow-500 text-black border-yellow-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
              }`}
            >
              <span className="material-symbols-outlined">settings</span>
              DIAGNOSTIC {diagnostic ? 'ON' : 'OVERRIDE'}
            </button>
          </div>

          <div className="bg-black/40 border-t border-slate-800 p-2.5 flex justify-between items-center text-[9px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'granted' ? 'bg-green-500' : status === 'denied' ? 'bg-red-500' : 'bg-green-500/50'}`} />
              <span>{status === 'granted' ? 'ACCESS_GRANTED' : status === 'denied' ? 'ACCESS_DENIED' : 'SYSTEM_READY'}</span>
            </div>
            <span>V.2.0.45-ALPHA</span>
          </div>
        </div>
      </div>
    </Layout>
  )
}
