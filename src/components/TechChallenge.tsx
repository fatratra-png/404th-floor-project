import { useState } from 'react'

interface TechQ { domain: string; question: string; options: string[]; answer: number }

const TECH_QUESTIONS: Record<number, TechQ> = {
  6: { domain: 'binary', question: 'In binary, what does 11111111 represent in decimal?', options: ['128', '255', '256', '127'], answer: 1 },
  7: { domain: 'networking', question: 'What protocol routes data between networks?', options: ['TCP', 'IP', 'HTTP', 'DNS'], answer: 1 },
  8: { domain: 'os', question: 'What is the core component of an operating system?', options: ['Shell', 'Kernel', 'Driver', 'Compiler'], answer: 1 },
  9: { domain: 'signals', question: 'What does SNR stand for?', options: ['Signal-to-Noise Ratio', 'System Network Router', 'Synchronous Node Response', 'Serial Number Register'], answer: 0 },
  10: { domain: 'algorithms', question: 'What algorithm finds the shortest path in a graph?', options: ["Dijkstra's", "Binary Search", "Merge Sort", "Depth-First Search"], answer: 0 },
  11: { domain: 'logic', question: 'Which gate outputs true only when inputs differ?', options: ['AND', 'OR', 'XOR', 'NAND'], answer: 2 },
  12: { domain: 'binary', question: 'What is 1010 in binary in decimal?', options: ['8', '10', '12', '16'], answer: 1 },
  13: { domain: 'ai', question: 'What type of ML learns from labeled data?', options: ['Unsupervised', 'Reinforcement', 'Supervised', 'Transfer'], answer: 2 },
  14: { domain: 'math', question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], answer: 1 },
  15: { domain: 'security', question: 'What is AES?', options: ['An encryption standard', 'A programming language', 'A network protocol', 'A database'], answer: 0 },
  16: { domain: 'sorting', question: "What's the worst-case complexity of QuickSort?", options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 2 },
  17: { domain: 'database', question: 'What SQL keyword retrieves data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 2 },
  18: { domain: 'ai', question: 'What is a neural network activation function?', options: ['ReLU', 'SQL', 'HTML', 'CSS'], answer: 0 },
  19: { domain: 'coding', question: 'What does API stand for?', options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Protocol Interface', 'Application Process Input'], answer: 0 },
  20: { domain: 'networking', question: 'What port does HTTP use by default?', options: ['22', '80', '443', '8080'], answer: 1 },
}

export default function TechChallenge({ floor, onComplete }: { floor: number; onComplete: () => void }) {
  const q = TECH_QUESTIONS[floor]
  const [selected, setSelected] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  if (!q) {
    onComplete()
    return null
  }

  const handleSubmit = () => {
    if (selected === q.answer) onComplete()
    else { setFailed(true); setSelected(null) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-primary/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-primary/10">
        <div className="text-center mb-6">
          <div className="text-[10px] font-mono text-primary/50 tracking-wider mb-2">TECHNICAL CHALLENGE — {q.domain.toUpperCase()}</div>
          <h2 className="text-lg font-bold text-white">Floor {floor} Gate</h2>
          <p className="text-slate-400 text-sm font-mono mt-3">{q.question}</p>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full py-3 px-4 rounded-lg font-mono text-sm border-2 text-left transition-all ${
                selected === i
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-primary/50'
              }`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
        {failed && <p className="text-red-400 text-xs font-mono text-center mb-3">WRONG — TRY AGAIN</p>}
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-3 bg-primary hover:bg-blue-600 disabled:opacity-30 rounded-lg text-white font-bold transition-all"
        >
          SUBMIT ANSWER
        </button>
      </div>
    </div>
  )
}
