export interface GameState {
  completedFloors: number[];
  startTime: number | null;
  currentFloor: number;
}

export interface FloorProps {
  onComplete: () => void;
  floorNumber: number;
}

export interface FuseItem {
  id: string;
  type: 'thermal' | 'quantum' | 'plasma';
  label: string;
  voltage: string;
  icon: string;
  color: string;
}

export interface SlotData {
  index: number;
  accept: string;
  filled: boolean;
  fuseType: string | null;
}

export interface BugType {
  label: string;
  icon: string;
  msg: string;
}

export enum PuzzleType {
  SORT = 'sort',
  TWO_SUM = 'two_sum',
  SEQUENCE = 'sequence',
  MAZE = 'maze',
  FACTOR = 'factor',
  BALANCE = 'balance',
  PALINDROME = 'palindrome',
  BINARY = 'binary',
  PATTERN = 'pattern',
  GRAPH = 'graph',
  CODING = 'coding',
  NETWORK = 'network',
  HEX = 'hex',
  MATH = 'math',
  AI = 'ai',
  DB = 'db',
}

export interface LevelDef {
  id: number
  name: string
  desc: string
  zone: string
  challenge: string
  type: PuzzleType
  diff: number
  config: PuzzleConfig
}

export type PuzzleConfig =
  | SortConfig
  | TwoSumConfig
  | SequenceConfig
  | MazeConfig
  | FactorConfig
  | BalanceConfig
  | PalindromeConfig
  | BinaryConfig
  | PatternConfig
  | GraphConfig
  | CodingConfig
  | NetworkConfig
  | HexConfig
  | MathConfig
  | AIConfig
  | DBConfig

export interface SortConfig {
  kind: PuzzleType.SORT
  values: number[]
  swaps: number
}

export interface TwoSumConfig {
  kind: PuzzleType.TWO_SUM
  numbers: number[]
  target: number
}

export interface SequenceConfig {
  kind: PuzzleType.SEQUENCE
  terms: number[]
  missingIndex: number
  answer: number
}

export interface MazeConfig {
  kind: PuzzleType.MAZE
  grid: number[][]
  start: [number, number]
  end: [number, number]
  width: number
  height: number
}

export interface FactorConfig {
  kind: PuzzleType.FACTOR
  number: number
  factors: number[]
}

export interface BalanceConfig {
  kind: PuzzleType.BALANCE
  expr: string
  balanced: boolean
}

export interface PalindromeConfig {
  kind: PuzzleType.PALINDROME
  text: string
  isPalindrome: boolean
}

export interface BinaryConfig {
  kind: PuzzleType.BINARY
  decimal: number
  binary: string
}

export interface PatternConfig {
  kind: PuzzleType.PATTERN
  items: string[]
  options: string[]
  answerIndex: number
}

export interface GraphConfig {
  kind: PuzzleType.GRAPH
  nodes: number
  edges: [number, number][]
  start: number
  end: number
}

export interface CodingConfig {
  kind: PuzzleType.CODING
  code: string
  question: string
  answer: string
  hint?: string
}

export interface NetworkConfig {
  kind: PuzzleType.NETWORK
  question: string
  options: string[]
  answerIndex: number
}

export interface HexConfig {
  kind: PuzzleType.HEX
  hex: string
  decimal: number
  direction: 'to_hex' | 'to_decimal'
}

export interface MathConfig {
  kind: PuzzleType.MATH
  question: string
  answer: number
}

export interface AIConfig {
  kind: PuzzleType.AI
  question: string
  options: string[]
  answerIndex: number
}

export interface DBConfig {
  kind: PuzzleType.DB
  question: string
  options: string[]
  answerIndex: number
}
