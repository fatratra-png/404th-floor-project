import { PuzzleType } from '../types'
import type { LevelDef, PuzzleConfig } from '../types'
import { generatePrimeFactors, checkBalanced, isPalindrome, generateSortedArray, generateMaze } from './puzzleEngine'

const ZONES = [
  { name: 'Knowledge Check', challenge: 'Technical Knowledge', types: [PuzzleType.CODING, PuzzleType.NETWORK, PuzzleType.AI, PuzzleType.DB] as PuzzleType[] },
  { name: 'Binary Basics', challenge: 'Number Systems', types: [PuzzleType.BINARY, PuzzleType.HEX, PuzzleType.MATH] as PuzzleType[] },
  { name: 'Sorting Core', challenge: 'Sorting Algorithms', types: [PuzzleType.SORT] as PuzzleType[] },
  { name: 'Search Domain', challenge: 'Searching Algorithms', types: [PuzzleType.TWO_SUM, PuzzleType.SORT] as PuzzleType[] },
  { name: 'Sequence Stream', challenge: 'Sequence Analysis', types: [PuzzleType.SEQUENCE, PuzzleType.PATTERN] as PuzzleType[] },
  { name: 'Graph Grid', challenge: 'Graph Theory', types: [PuzzleType.GRAPH, PuzzleType.MAZE] as PuzzleType[] },
  { name: 'Logic Core', challenge: 'Logical Deduction', types: [PuzzleType.BALANCE, PuzzleType.PALINDROME] as PuzzleType[] },
  { name: 'Combinatorial Vault', challenge: 'Combinatorics', types: [PuzzleType.FACTOR, PuzzleType.TWO_SUM] as PuzzleType[] },
  { name: 'Numerical Forge', challenge: 'Number Theory', types: [PuzzleType.BINARY, PuzzleType.HEX] as PuzzleType[] },
  { name: 'Cipher Wing', challenge: 'String Algorithms', types: [PuzzleType.PALINDROME, PuzzleType.CODING] as PuzzleType[] },
  { name: 'Data Buffer', challenge: 'Data Structures', types: [PuzzleType.SORT, PuzzleType.GRAPH] as PuzzleType[] },
  { name: 'The Overclock', challenge: 'Mixed Algorithms', types: [PuzzleType.SEQUENCE, PuzzleType.MAZE, PuzzleType.BINARY, PuzzleType.PATTERN] as PuzzleType[] },
  { name: 'Protocol Gate', challenge: 'Networking & Protocols', types: [PuzzleType.NETWORK, PuzzleType.CODING] as PuzzleType[] },
  { name: 'AI Core', challenge: 'Artificial Intelligence', types: [PuzzleType.AI, PuzzleType.MATH] as PuzzleType[] },
  { name: 'Data Vault', challenge: 'Database Systems', types: [PuzzleType.DB, PuzzleType.BINARY] as PuzzleType[] },
  { name: 'Math Forge', challenge: 'Advanced Mathematics', types: [PuzzleType.MATH, PuzzleType.HEX] as PuzzleType[] },
  { name: 'Polyglot Chamber', challenge: 'Mixed Domains', types: [PuzzleType.CODING, PuzzleType.NETWORK, PuzzleType.AI, PuzzleType.DB] as PuzzleType[] },
]

const ADJS = [
  'Abyssal', 'Binary', 'Corrupted', 'Dynamic', 'Encrypted', 'Fractal', 'Gaussian', 'Heuristic',
  'Inverted', 'Jumbled', 'Kinetic', 'Latent', 'Mutable', 'Nested', 'Oscillating', 'Parity',
  'Quantum', 'Recursive', 'Stochastic', 'Ternary', 'Unstable', 'Vector', 'Warped', 'Xenomorphic',
  'Yieldless', 'Zero-Sum', 'Adaptive', 'Broken', 'Cyclic', 'Degraded', 'Elastic', 'Flooded',
  'Granular', 'Hybrid', 'Inductive', 'Jagged', 'Knotted', 'Linearized', 'Morphic', 'Nonlinear',
]

const NOUNS = [
  'Array', 'Buffer', 'Cache', 'Depths', 'Edge', 'Fragment', 'Gate', 'Heap', 'Index', 'Junction',
  'Kernel', 'Link', 'Matrix', 'Node', 'Overflow', 'Page', 'Queue', 'Register', 'Stack', 'Thread',
  'Unit', 'Vector', 'Word', 'XOR', 'Yield', 'Zero', 'Access', 'Block', 'Cell', 'Domain',
  'Element', 'Field', 'Grid', 'Hash', 'Interval', 'Layer', 'Module', 'Network', 'Port', 'Row',
  'Sector', 'Tile', 'Vertex', 'Wave', 'Axis', 'Branch', 'Core', 'Drive', 'Frame', 'Loop',
]

const NAV = ['elevator', 'building', 'system', 'mainframe', 'node', 'network', 'server', 'matrix']
const VERBS = ['resolve', 'debug', 'restore', 'repair', 'recompile', 'recalibrate', 'purge', 'align']
const GOALS = ['restore stability', 'fix the corruption', 're-establish connection', 'balance the system', 'clear the error']

function seeded(id: number): number {
  return ((Math.sin(id * 9301.141 + 49297.535) * 49297) % 1 + 1) % 1
}

function pick<T>(arr: T[], id: number, offset = 0): T {
  return arr[Math.floor(((seeded(id + 1) * 100 + offset) % 1) * arr.length)]
}

function randInt(id: number, min: number, max: number, offset = 0): number {
  return min + Math.floor(((seeded(id * 3 + 7 + offset) * 100 + offset) % 1) * (max - min + 1))
}

function genName(id: number): string {
  const adj = pick(ADJS, id, 0)
  const noun = pick(NOUNS, id, 7)
  const tpl = Math.floor(seeded(id * 5 + 3) * 4)
  if (tpl === 0) return `${adj} ${noun}`
  if (tpl === 1) return `The ${adj} ${noun}`
  if (tpl === 2) return `${noun} of ${adj}s`
  return `Corrupted ${noun}`
}

function genDesc(id: number, zone: string, challenge: string, type: string): string {
  const n = pick(NAV, id, 0)
  const v = pick(VERBS, id, 3)
  const g = pick(GOALS, id, 7)
  const subsys = pick(['processing core', 'memory bank', 'data bus', 'power grid', 'logic unit', 'network hub', 'crypto module', 'cache layer', 'routing table', 'pipeline', 'AI cluster', 'database node', 'protocol stack', 'math co-processor'], id, 11)
  const problem = pick(['segmentation fault', 'deadlock', 'race condition', 'buffer overflow', 'infinite loop', 'null pointer', 'stack underflow', 'type mismatch', 'checksum error', 'corrupt header', 'parity error', 'alignment fault', 'neural collapse', 'query timeout', 'protocol mismatch', 'overflow error'], id, 13)
  const hex = (id * 73 + 41).toString(16).toUpperCase().padStart(4, '0')
  const ts = Math.floor(seeded(id * 11) * 5)
  if (ts === 0) return `Floor ${id}: ${subsys.toUpperCase()} corrupted by ${problem}. Use ${challenge.toLowerCase()} to ${v} the ${n}.`
  if (ts === 1) return `ERROR 0x${hex} — ${problem.toUpperCase()} at node #${id}. The ${n}'s ${subsys} needs ${challenge.toLowerCase()} to ${g}.`
  if (ts === 2) return `The ${n}'s ${subsys} is glitching (${problem}). Only a ${type.replace('_', ' ')} puzzle stands between you and ${g}.`
  return `CRITICAL: ${problem.charAt(0).toUpperCase() + problem.slice(1)} in ${subsys}. Solve the ${challenge.toLowerCase()} challenge to ${v} floor ${id}.`
}

function genSortConfig(id: number): PuzzleConfig {
  const n = Math.min(4 + Math.floor(((seeded(id * 7 + 1) * 100) % 1) * 5), 10)
  const arr = generateSortedArray(n)
  const shuffleCount = Math.min(3 + randInt(id, 1, 5, 3), n * 2)
  for (let i = 0; i < shuffleCount; i++) {
    const a = Math.floor(Math.random() * n)
    const b = Math.floor(Math.random() * n)
    if (a !== b) { const t = arr[a]; arr[a] = arr[b]; arr[b] = t }
  }
  return { kind: PuzzleType.SORT, values: arr, swaps: shuffleCount }
}

function genTwoSumConfig(id: number): PuzzleConfig {
  const n = 5 + randInt(id, 1, 6, 0)
  const nums: number[] = []
  for (let i = 0; i < n; i++) nums.push(randInt(id, 2, 20, i))
  const ai = randInt(id, 0, n - 1, 0)
  let bi = randInt(id, 0, n - 1, 7)
  while (bi === ai) bi = (bi + 1) % n
  const target = nums[ai] + nums[bi]
  return { kind: PuzzleType.TWO_SUM, numbers: nums, target }
}

function genSequenceConfig(id: number): PuzzleConfig {
  const t = randInt(id, 0, 3, 0)
  const n = 5
  const terms: number[] = []
  let answer = 0
  let missingIndex = 2
  for (let i = 0; i < n; i++) {
    if (t === 0) terms.push(3 + i * randInt(id, 2, 5, i))
    else if (t === 1) terms.push(Math.max(1, Math.floor(2 * Math.pow(1.5 + seeded(id * 3 + i) * 0.5, i))))
    else if (t === 2) { const f = [1, 1]; for (let j = 2; j < n; j++) f.push(f[j - 1] + f[j - 2]); if (i < f.length) terms.push(f[i]); else terms.push(1) }
    else terms.push(i * i + 1)
  }
  missingIndex = randInt(id, 1, n - 2, 0)
  answer = terms[missingIndex]
  terms[missingIndex] = -1
  return { kind: PuzzleType.SEQUENCE, terms, missingIndex, answer }
}

function genMazeConfig(id: number): PuzzleConfig {
  const s = 3 + randInt(id, 0, 4, 0)
  const { grid, start, end } = generateMaze(s, s)
  return { kind: PuzzleType.MAZE, grid, start, end, width: s, height: s }
}

function genFactorConfig(id: number): PuzzleConfig {
  const bases = [2, 3, 5, 7, 11, 13]
  const count = 1 + randInt(id, 0, 2, 0)
  const factors: number[] = []
  for (let i = 0; i < count; i++) factors.push(pick(bases, id + i * 7, i * 3))
  const n = factors.reduce((a, b) => a * b, 1)
  return { kind: PuzzleType.FACTOR, number: n, factors: generatePrimeFactors(n) }
}

function genBalanceConfig(id: number): PuzzleConfig {
  const depth = 1 + randInt(id, 0, 3, 0)
  const pairs: { open: string; close: string }[] = [{ open: '(', close: ')' }, { open: '[', close: ']' }, { open: '{', close: '}' }]
  let expr = ''
  for (let i = 0; i < depth + 1; i++) {
    const p = pick(pairs, id + i * 3, i * 5)
    if (seeded(id * 7 + i * 13) > 0.5) { expr += p.open; if (Math.random() > 0.3) expr += p.close; else 0 }
    else expr += p.open + p.close
  }
  if (seeded(id * 17) > 0.7 && expr.length > 2) {
    const pos = randInt(id, 1, expr.length - 1, 0)
    expr = expr.slice(0, pos) + (expr[pos] === ')' || expr[pos] === ']' || expr[pos] === '}' ? expr[pos] : ')') + expr.slice(pos + 1)
  }
  const balanced = checkBalanced(expr)
  return { kind: PuzzleType.BALANCE, expr, balanced }
}

function genPalindromeConfig(id: number): PuzzleConfig {
  const words = ['racecar', 'level', 'radar', 'civic', 'kayak', 'madam', 'refer', 'tenet', 'noon', 'stats', 'hello', 'world', 'puzzle', 'escape', 'elevator', 'broken', 'matrix', 'python', 'coding', 'sorted']
  const word = pick(words, id, 0)
  const isPal = isPalindrome(word)
  if (seeded(id * 23) > 0.7) {
    const newWord = word.split('').reverse().join('')
    const rIdx = randInt(id, 0, newWord.length - 1, 0)
    const rep = String.fromCharCode(97 + randInt(id, 0, 25, 7))
    const modified = newWord.slice(0, rIdx) + rep + newWord.slice(rIdx + 1)
    return { kind: PuzzleType.PALINDROME, text: modified, isPalindrome: isPalindrome(modified) }
  }
  return { kind: PuzzleType.PALINDROME, text: word, isPalindrome: isPal }
}

function genBinaryConfig(id: number): PuzzleConfig {
  const d = randInt(id, 4, 255, 0)
  const bin = d.toString(2)
  return { kind: PuzzleType.BINARY, decimal: d, binary: bin }
}

function genPatternConfig(id: number): PuzzleConfig {
  const n = 3 + randInt(id, 0, 3, 0)
  const start = randInt(id, 1, 10, 0)
  const step = 1 + randInt(id, 1, 5, 7)
  const items: string[] = []
  for (let i = 0; i < n; i++) items.push(String(start + i * step))
  const answer = start + n * step
  const options = [String(answer), String(answer + 1), String(answer - 1), String(answer + step), String(answer - step), String(answer * 2)]
  const shuffled = [...options].sort(() => Math.random() - 0.5)
  const answerIndex = shuffled.indexOf(String(answer))
  return { kind: PuzzleType.PATTERN, items, options: shuffled, answerIndex }
}

function genGraphConfig(id: number): PuzzleConfig {
  const n = 3 + randInt(id, 0, 4, 0)
  const edges: [number, number][] = []
  for (let i = 1; i < n; i++) edges.push([i - 1, i])
  const extra = randInt(id, 0, Math.min(3, n * (n - 1) / 2 - n + 1), 0)
  for (let i = 0; i < extra; i++) {
    const a = randInt(id, 0, n - 1, i * 3)
    let b = randInt(id, 0, n - 1, i * 3 + 7)
    while (b === a) b = (b + 1) % n
    if (!edges.some(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a))) edges.push([a, b])
  }
  return { kind: PuzzleType.GRAPH, nodes: n, edges, start: 0, end: n - 1 }
}

const CODING_QUESTIONS = [
  { q: 'What keyword declares a function in Python?', a: 'def' },
  { q: 'In JavaScript, what method adds an element to the end of an array?', a: 'push' },
  { q: 'What operator checks equality in Python?', a: '==' },
  { q: 'What keyword is used to define a constant in JavaScript (ES6)?', a: 'const' },
  { q: 'What function prints to console in Python?', a: 'print' },
  { q: 'In C, what function reads formatted input?', a: 'scanf' },
  { q: 'What symbol starts a comment in Python?', a: '#' },
  { q: 'What keyword exits a loop early in Java?', a: 'break' },
  { q: 'What data structure is LIFO?', a: 'stack' },
  { q: 'What method joins array elements into a string in JavaScript?', a: 'join' },
  { q: 'What keyword defines a class in Python?', a: 'class' },
  { q: 'What does `typeof` return for an array in JavaScript?', a: 'object' },
  { q: 'In Python, what keyword handles exceptions?', a: 'try' },
  { q: 'What is the time complexity of binary search?', a: 'O(log n)' },
  { q: 'What sorting algorithm has O(n log n) average case?', a: 'mergesort' },
]

const NETWORK_QUESTIONS = [
  { q: 'What protocol translates domain names to IP addresses?', opts: ['HTTP', 'DNS', 'DHCP', 'FTP'], ans: 1 },
  { q: 'What port does HTTPS use by default?', opts: ['80', '443', '22', '8080'], ans: 1 },
  { q: 'What does LAN stand for?', opts: ['Large Area Network', 'Local Area Network', 'Long Access Node', 'Linked Array Network'], ans: 1 },
  { q: 'Which layer of OSI handles routing?', opts: ['Physical', 'Data Link', 'Network', 'Transport'], ans: 2 },
  { q: 'What protocol is used for email transmission?', opts: ['FTP', 'SMTP', 'HTTP', 'TCP'], ans: 1 },
  { q: 'What is a subnet mask used for?', opts: ['Encryption', 'Network partitioning', 'Routing', 'DNS resolution'], ans: 1 },
  { q: 'What does TCP stand for?', opts: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Terminal Connection Protocol', 'Transport Communication Protocol'], ans: 1 },
  { q: 'What device connects different networks?', opts: ['Switch', 'Hub', 'Router', 'Modem'], ans: 2 },
  { q: 'What is the loopback IP address?', opts: ['0.0.0.0', '127.0.0.1', '192.168.0.1', '10.0.0.1'], ans: 1 },
  { q: 'What protocol provides automatic IP assignment?', opts: ['DNS', 'HTTP', 'DHCP', 'ARP'], ans: 2 },
  { q: 'What does NAT stand for?', opts: ['Network Access Table', 'Network Address Translation', 'Node Allocation Tree', 'Net Address Transfer'], ans: 1 },
  { q: 'What is the maximum port number?', opts: ['1024', '65535', '255', '32768'], ans: 1 },
  { q: 'Which protocol is connectionless?', opts: ['TCP', 'UDP', 'HTTP', 'FTP'], ans: 1 },
  { q: 'What does ICMP stand for?', opts: ['Internet Control Message Protocol', 'Internal Connection Management Protocol', 'Inter-network Communication Main Protocol', 'Integrated Circuit Message Program'], ans: 0 },
  { q: 'What is the purpose of a firewall?', opts: ['Speed up connection', 'Filter network traffic', 'Assign IPs', 'Resolve domains'], ans: 1 },
]

const AI_QUESTIONS = [
  { q: 'What does "ML" stand for in AI?', opts: ['Machine Logic', 'Machine Learning', 'Memory Load', 'Meta Language'], ans: 1 },
  { q: 'What is a neural network inspired by?', opts: ['The internet', 'The human brain', 'Quantum physics', 'Evolution'], ans: 1 },
  { q: 'What is the activation function commonly used in deep learning?', opts: ['Sigmoid', 'ReLU', 'Tanh', 'All of the above'], ans: 3 },
  { q: 'What is supervised learning?', opts: ['Learning without labels', 'Learning with labeled data', 'Learning by trial and error', 'Learning from rewards'], ans: 1 },
  { q: 'What is overfitting in ML?', opts: ['Model performs well on training but poorly on test', 'Model fails to converge', 'Model is too simple', 'Dataset is too large'], ans: 0 },
  { q: 'What is backpropagation used for?', opts: ['Forward pass', 'Gradient computation', 'Data preprocessing', 'Model evaluation'], ans: 1 },
  { q: 'What is a loss function?', opts: ['A function that measures error', 'A function that saves models', 'A function that loads data', 'A function that plots graphs'], ans: 0 },
  { q: 'What does CNN stand for?', opts: ['Complex Neural Network', 'Convolutional Neural Network', 'Central Node Network', 'Cascading Neural Net'], ans: 1 },
  { q: 'What is reinforcement learning?', opts: ['Learning from labeled data', 'Learning from rewards and punishment', 'Learning from static datasets', 'Learning from unsupervised clustering'], ans: 1 },
  { q: 'What is a "feature" in ML?', opts: ['A model parameter', 'An input variable', 'An output label', 'A training loop'], ans: 1 },
  { q: 'What is gradient descent?', opts: ['Going up the slope', 'Optimization algorithm to minimize loss', 'Data augmentation method', 'Model architecture'], ans: 1 },
  { q: 'What is a transformer used for?', opts: ['Image classification', 'Sequence-to-sequence tasks', 'Clustering', 'Dimensionality reduction'], ans: 1 },
  { q: 'What does RNN stand for?', opts: ['Recurrent Neural Network', 'Random Node Network', 'Recursive Neural Net', 'Regularized Neural Network'], ans: 0 },
  { q: 'What is transfer learning?', opts: ['Using pre-trained model on new task', 'Copying data between servers', 'Migrating models to production', 'Sharing datasets'], ans: 0 },
  { q: 'What is a "epoch" in ML training?', opts: ['One full pass through training data', 'A single batch', 'A model layer', 'A learning rate adjustment'], ans: 0 },
]

const DB_QUESTIONS = [
  { q: 'What SQL keyword retrieves data?', opts: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'], ans: 1 },
  { q: 'What does SQL stand for?', opts: ['Simple Query Language', 'Structured Query Language', 'Sequential Query Logic', 'Standard Query Library'], ans: 1 },
  { q: 'What keyword removes a table in SQL?', opts: ['DELETE', 'DROP', 'REMOVE', 'ERASE'], ans: 1 },
  { q: 'What is a primary key?', opts: ['A unique identifier for rows', 'A foreign reference', 'An index', 'A data type'], ans: 0 },
  { q: 'What does JOIN do in SQL?', opts: ['Combines rows from tables', 'Deletes tables', 'Creates indexes', 'Orders results'], ans: 0 },
  { q: 'What is normalization?', opts: ['Reducing data redundancy', 'Increasing data size', 'Encrypting data', 'Indexing tables'], ans: 0 },
  { q: 'What is a foreign key?', opts: ['A key that references another table', 'A unique column', 'A primary key', 'An encrypted key'], ans: 0 },
  { q: 'What does ACID stand for?', opts: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Input, Data', 'Add, Commit, Insert, Delete', 'All, Core, Index, Data'], ans: 0 },
  { q: 'What is an index used for?', opts: ['Faster queries', 'Data encryption', 'Table creation', 'User authentication'], ans: 0 },
  { q: 'What SQL clause filters rows?', opts: ['WHERE', 'HAVING', 'FILTER', 'MATCH'], ans: 0 },
  { q: 'What is a transaction in DB?', opts: ['A unit of work', 'A single query', 'A table operation', 'A backup'], ans: 0 },
  { q: 'What does NoSQL mean?', opts: ['No SQL at all', 'Not Only SQL', 'Non-relational databases', 'Both B and C'], ans: 3 },
  { q: 'What is a view in SQL?', opts: ['A virtual table', 'A physical table', 'An index', 'A backup'], ans: 0 },
  { q: 'What is a deadlock in databases?', opts: ['Two transactions waiting on each other', 'A crashed server', 'A corrupt table', 'A slow query'], ans: 0 },
  { q: 'What does GROUP BY do?', opts: ['Groups rows with same values', 'Orders results', 'Filters rows', 'Joins tables'], ans: 0 },
]

const MATH_QUESTIONS = [
  { q: 'What is the square root of 144?', a: 12 },
  { q: 'What is 15% of 200?', a: 30 },
  { q: 'What is 2^10?', a: 1024 },
  { q: 'What is 7! (7 factorial)?', a: 5040 },
  { q: 'What is the sum of angles in a triangle (degrees)?', a: 180 },
  { q: 'What is 25 × 16?', a: 400 },
  { q: 'What is 3^5?', a: 243 },
  { q: 'How many sides does a dodecagon have?', a: 12 },
  { q: 'What is log₂(256)?', a: 8 },
  { q: 'What is 13 × 13?', a: 169 },
  { q: 'What is 0.5 as a fraction (numerator)?', a: 1 },
  { q: 'What is the next prime after 17?', a: 19 },
  { q: 'What is 2^8?', a: 256 },
  { q: 'What is 1001 in decimal?', a: 9 },
  { q: 'How many degrees in a circle?', a: 360 },
]

const REACT_QUESTIONS = [
  { q: 'What hook is used for side effects in React?', opts: ['useEffect', 'useState', 'useCallback', 'useMemo'], ans: 0 },
  { q: 'What does JSX stand for?', opts: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript XHR'], ans: 0 },
  { q: 'What hook stores component state?', opts: ['useEffect', 'useState', 'useReducer', 'useRef'], ans: 1 },
  { q: 'What is a React component?', opts: ['A function returning JSX', 'A CSS class', 'An HTML tag', 'A JavaScript promise'], ans: 0 },
  { q: 'What is the virtual DOM?', opts: ['A lightweight copy of the DOM', 'The real browser DOM', 'A database', 'A CSS framework'], ans: 0 },
  { q: 'What prop is used for inline styles in React?', opts: ['styles', 'style', 'className', 'css'], ans: 1 },
  { q: 'What hook replaces componentDidMount?', opts: ['useEffect', 'useState', 'useRef', 'useLayoutEffect'], ans: 0 },
  { q: 'What is a key prop used for?', opts: ['Identifying list items', 'Styling elements', 'API keys', 'Encryption'], ans: 0 },
  { q: 'What does useRef return?', opts: ['A mutable ref object', 'A state variable', 'A CSS class', 'A DOM event'], ans: 0 },
  { q: 'What is React context used for?', opts: ['Prop drilling avoidance', 'API calls', 'Routing', 'Form validation'], ans: 0 },
  { q: 'What hook memoizes a value?', opts: ['useMemo', 'useCallback', 'useEffect', 'useState'], ans: 0 },
  { q: 'What does createPortal do?', opts: ['Renders outside parent DOM', 'Creates new routes', 'Opens modals', 'Fetches data'], ans: 0 },
  { q: 'What is a custom hook?', opts: ['A function using other hooks', 'A built-in hook', 'A React component', 'A plugin'], ans: 0 },
  { q: 'What is the purpose of StrictMode?', opts: ['Highlight potential problems', 'Strict typing', 'Performance optimization', 'Accessibility checks'], ans: 0 },
  { q: 'What is reconciliation in React?', opts: ['Diffing algorithm for updates', 'Database sync', 'State management', 'API integration'], ans: 0 },
]

const JAVA_QUESTIONS = [
  { q: 'What is the JVM?', opts: ['Java Virtual Machine', 'Java Version Manager', 'Java Variable Model', 'Java Visual Machine'], ans: 0 },
  { q: 'What keyword creates a new object in Java?', opts: ['new', 'create', 'object', 'alloc'], ans: 0 },
  { q: 'What is inheritance in Java?', opts: ['A class deriving from another', 'Importing libraries', 'Creating instances', 'Method overloading'], ans: 0 },
  { q: 'What does static mean in Java?', opts: ['Belongs to class not instance', 'Dynamic allocation', 'Thread-safe', 'Immutable'], ans: 0 },
  { q: 'What is the main method signature?', opts: ['public static void main', 'public void main', 'static void main', 'private static main'], ans: 0 },
  { q: 'What is an interface in Java?', opts: ['A contract of abstract methods', 'A concrete class', 'A data structure', 'A UI component'], ans: 0 },
  { q: 'What is polymorphism?', opts: ['Many forms of a method', 'Single form', 'Data hiding', 'Memory management'], ans: 0 },
  { q: 'What keyword prevents inheritance?', opts: ['final', 'static', 'private', 'abstract'], ans: 0 },
  { q: 'What is a constructor?', opts: ['Initializes objects', 'Destroys objects', 'Creates threads', 'Manages memory'], ans: 0 },
  { q: 'What is the super keyword?', opts: ['Refers to parent class', 'Calls static methods', 'Creates instances', 'Defines constants'], ans: 0 },
  { q: 'What is method overloading?', opts: ['Same name different params', 'Different name same params', 'Hiding methods', 'Overriding methods'], ans: 0 },
  { q: 'What is an exception?', opts: ['An error event', 'A normal flow', 'A data type', 'A loop construct'], ans: 0 },
  { q: 'What does ArrayList store?', opts: ['Dynamic arrays', 'Static arrays', 'Linked lists', 'Hash maps'], ans: 0 },
  { q: 'What is the garbage collector?', opts: ['Frees unused memory', 'Collects data', 'Manages threads', 'Handles I/O'], ans: 0 },
  { q: 'What is a package in Java?', opts: ['A namespace for classes', 'A compressed file', 'A library', 'A framework'], ans: 0 },
]

const PYTHON_QUESTIONS = [
  { q: 'What is PEP 8?', opts: ['Python style guide', 'Python editor', 'Python package', 'Python version'], ans: 0 },
  { q: 'What is a list comprehension?', opts: ['Concise list creation', 'List sorting', 'List copying', 'List indexing'], ans: 0 },
  { q: 'What is a decorator in Python?', opts: ['Modifies functions/methods', 'A design pattern', 'A data type', 'A loop construct'], ans: 0 },
  { q: 'What is __init__?', opts: ['Class constructor', 'Module import', 'Variable initializer', 'Function decorator'], ans: 0 },
  { q: 'What is a lambda in Python?', opts: ['Anonymous function', 'Named function', 'A class', 'A module'], ans: 0 },
  { q: 'What does len() return?', opts: ['Length of a sequence', 'Last element', 'Maximum value', 'Minimum value'], ans: 0 },
  { q: 'What is a tuple?', opts: ['Immutable sequence', 'Mutable list', 'A function', 'A dictionary'], ans: 0 },
  { q: 'What is slicing in Python?', opts: ['Extracting subsequences', 'Cutting strings', 'Deleting elements', 'Reversing lists'], ans: 0 },
  { q: 'What is a dictionary?', opts: ['Key-value store', 'Ordered list', 'A set', 'A function'], ans: 0 },
  { q: 'What does the with statement do?', opts: ['Context management', 'Loops', 'Conditionals', 'Imports'], ans: 0 },
  { q: 'What is a generator?', opts: ['Yields values lazily', 'Creates lists', 'Generates numbers', 'A data type'], ans: 0 },
  { q: 'What is pickling?', opts: ['Serializing objects', 'Describing objects', 'Selecting items', 'Sorting data'], ans: 0 },
  { q: 'What is a class variable?', opts: ['Shared across instances', 'Per-instance data', 'Local variable', 'Global variable'], ans: 0 },
  { q: 'What is the GIL?', opts: ['Global Interpreter Lock', 'General Import Library', 'Graphics Interface Layer', 'Generated Instruction List'], ans: 0 },
  { q: 'What is pip?', opts: ['Package installer', 'Python interpreter', 'Code formatter', 'Debugger'], ans: 0 },
]

function genCodingConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, CODING_QUESTIONS.length - 1, 0)
  const q = CODING_QUESTIONS[idx]
  return {
    kind: PuzzleType.CODING,
    code: `// Programming knowledge check\n// ${q.q}`,
    question: q.q,
    answer: q.a,
  }
}

function genNetworkConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, NETWORK_QUESTIONS.length - 1, 0)
  const q = NETWORK_QUESTIONS[idx]
  return {
    kind: PuzzleType.NETWORK,
    question: q.q,
    options: q.opts,
    answerIndex: q.ans,
  }
}

function genHexConfig(id: number): PuzzleConfig {
  const d = randInt(id, 16, 255, 0)
  const h = d.toString(16).toUpperCase()
  const toHex = seeded(id * 31) > 0.5
  if (toHex) {
    return { kind: PuzzleType.HEX, hex: h, decimal: d, direction: 'to_hex' }
  }
  return { kind: PuzzleType.HEX, hex: h, decimal: d, direction: 'to_decimal' }
}

function genMathConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, MATH_QUESTIONS.length - 1, 0)
  const q = MATH_QUESTIONS[idx]
  return { kind: PuzzleType.MATH, question: q.q, answer: q.a }
}

function genAIConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, AI_QUESTIONS.length - 1, 0)
  const q = AI_QUESTIONS[idx]
  return {
    kind: PuzzleType.AI,
    question: q.q,
    options: q.opts,
    answerIndex: q.ans,
  }
}

function genDBConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, DB_QUESTIONS.length - 1, 0)
  const q = DB_QUESTIONS[idx]
  return {
    kind: PuzzleType.DB,
    question: q.q,
    options: q.opts,
    answerIndex: q.ans,
  }
}

function genReactConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, REACT_QUESTIONS.length - 1, 0)
  const q = REACT_QUESTIONS[idx]
  return {
    kind: PuzzleType.REACT,
    question: q.q,
    options: q.opts,
    answerIndex: q.ans,
  }
}

function genJavaConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, JAVA_QUESTIONS.length - 1, 0)
  const q = JAVA_QUESTIONS[idx]
  return {
    kind: PuzzleType.JAVA,
    question: q.q,
    options: q.opts,
    answerIndex: q.ans,
  }
}

function genPythonConfig(id: number): PuzzleConfig {
  const idx = randInt(id, 0, PYTHON_QUESTIONS.length - 1, 0)
  const q = PYTHON_QUESTIONS[idx]
  return {
    kind: PuzzleType.PYTHON,
    question: q.q,
    options: q.opts,
    answerIndex: q.ans,
  }
}

function generateLevel(id: number): LevelDef {
  const zoneIdx = Math.min(Math.floor(((id - 1) / 23.6)), ZONES.length - 1)
  const zone = ZONES[zoneIdx]
  const localIdx = id - 1 - zoneIdx * 23
  const type = zone.types[localIdx % zone.types.length]
  const diff = Math.min(1 + Math.floor(((seeded(id * 13 + 5) * 100) % 1) * 10), 10)

  let config: PuzzleConfig
  switch (type) {
    case PuzzleType.SORT: config = genSortConfig(id); break
    case PuzzleType.TWO_SUM: config = genTwoSumConfig(id); break
    case PuzzleType.SEQUENCE: config = genSequenceConfig(id); break
    case PuzzleType.MAZE: config = genMazeConfig(id); break
    case PuzzleType.FACTOR: config = genFactorConfig(id); break
    case PuzzleType.BALANCE: config = genBalanceConfig(id); break
    case PuzzleType.PALINDROME: config = genPalindromeConfig(id); break
    case PuzzleType.BINARY: config = genBinaryConfig(id); break
    case PuzzleType.PATTERN: config = genPatternConfig(id); break
    case PuzzleType.GRAPH: config = genGraphConfig(id); break
    case PuzzleType.CODING: config = genCodingConfig(id); break
    case PuzzleType.NETWORK: config = genNetworkConfig(id); break
    case PuzzleType.HEX: config = genHexConfig(id); break
    case PuzzleType.MATH: config = genMathConfig(id); break
    case PuzzleType.AI: config = genAIConfig(id); break
    case PuzzleType.DB: config = genDBConfig(id); break
    case PuzzleType.REACT: config = genReactConfig(id); break
    case PuzzleType.JAVA: config = genJavaConfig(id); break
    case PuzzleType.PYTHON: config = genPythonConfig(id); break
  }

  return {
    id,
    name: genName(id),
    desc: genDesc(id, zone.name, zone.challenge, type),
    zone: zone.name,
    challenge: zone.challenge,
    type,
    diff,
    config,
  }
}

function generateFloor404(): LevelDef {
  return {
    id: 404,
    name: 'The Cringe Void',
    desc: 'FLOOR 404: THE CRINGE VOID. You have reached the most uncomfortable floor in existence. The elevator groans with secondhand embarrassment. Every bad coding pun, every cringey tech meme, every "Hello World" that thought it was profound — they all live here. To escape, you must answer the Ultimate Cringe Question. There is no correct answer. There is only the cringe. Good luck, you absolute legend. You are valid. ✨',
    zone: 'The Cringe Zone',
    challenge: 'Cringe Compliance',
    type: PuzzleType.CODING,
    diff: 10,
    config: {
      kind: PuzzleType.CODING,
      code: `// "HELLO WORLD" IN EVERY LANGUAGE\n// But like... have you tried turning it off and on again?\n// *holds up spork*`,
      question: 'Type the ONLY acceptable answer to "Hello World" to ascend. (Hint: it\'s what every programmer writes first)',
      answer: 'hello world',
    },
  }
}

const GENERATED_COUNT = 403

export const LEVELS: LevelDef[] = [
  ...Array.from({ length: GENERATED_COUNT }, (_, i) => i + 1).map(generateLevel),
  generateFloor404(),
]

export function getLevel(id: number): LevelDef | undefined {
  return LEVELS.find(l => l.id === id)
}

export function isGeneratedLevel(id: number): boolean {
  return id >= 1 && id <= 404
}
