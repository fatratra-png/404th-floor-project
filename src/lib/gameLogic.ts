import type { BugType } from '../types';

export const PROGRESS_KEY = '404floor_progress';

interface GameState {
  floor1?: 'completed'
  floor2?: 'completed'
  floor3?: 'completed'
  floor4?: 'completed'
  floor5?: 'completed'
  floor6?: 'completed'
  floor7?: 'completed'
  floor8?: 'completed'
  floor9?: 'completed'
  floor10?: 'completed'
  floor11?: 'completed'
  floor12?: 'completed'
  floor13?: 'completed'
  floor14?: 'completed'
  floor15?: 'completed'
  floor16?: 'completed'
  floor17?: 'completed'
  floor18?: 'completed'
  floor19?: 'completed'
  floor20?: 'completed'
  startTime?: number
  [key: string]: string | number | undefined
}

export function getState(): GameState {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function markComplete(floor: number) {
  const s = getState();
  s[`floor${floor}`] = 'completed';
  if (!s.startTime) s.startTime = Date.now();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(s));
}

export function isCompleted(floor: number): boolean {
  return getState()[`floor${floor}`] === 'completed';
}

export function isFloorUnlocked(floor: number): boolean {
  if (floor === 1) return true;
  return isCompleted(floor - 1);
}

export function getCompletedCount(): number {
  const s = getState();
  return Object.keys(s).filter(k => k.startsWith('floor') && s[k] === 'completed').length;
}

export function isCurrentFloorFinished(floor: number): boolean {
  return isCompleted(floor);
}

export function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
}

// Floor 4 - Bug types
export const BUG_TYPES: BugType[] = [
  { label: 'ERR_01', icon: '🐛', msg: 'Uncaught ReferenceError' },
  { label: 'ERR_02', icon: '💀', msg: 'Stack Overflow' },
  { label: 'ERR_03', icon: '⚠️', msg: 'undefined is not a function' },
  { label: 'ERR_404', icon: '👾', msg: 'Memory leak detected' },
  { label: 'ERR_NaN', icon: '🔥', msg: 'NaN at Elevator.js:404' },
  { label: 'ERR_NULL', icon: '🌀', msg: 'Null pointer exception' },
  { label: 'ERR_TYPE', icon: '💢', msg: 'TypeError: circular reference' },
];

// Floor 5 - Memory sequences
export function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 4));
}

// Floor 6 - Circuit balance target
export function generateCircuitTarget(difficulty: number): number {
  return 50 + Math.floor(Math.random() * (30 - difficulty));
}

// Floor 7 - Wire cipher
export function generateCipher(length: number): { colors: string[]; solution: string[] } {
  const colorPool = ['red', 'blue', 'green', 'yellow', 'purple'];
  const colors: string[] = [];
  const solution: string[] = [];
  for (let i = 0; i < length; i++) {
    const c = colorPool[Math.floor(Math.random() * colorPool.length)];
    colors.push(c);
    solution.push(c);
  }
  return { colors, solution };
}
