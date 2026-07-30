import type { BugType } from '../types';

export const PROGRESS_KEY = '404floor_progress';

interface GameState {
  [key: string]: string | number | undefined
  startTime?: number
  score?: number
  hintsUsed?: number
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
  if (typeof s.score !== 'number') s.score = 0;
  s.score = (s.score as number) + Math.max(10, 100 - floor);
  if (typeof s.hintsUsed !== 'number') s.hintsUsed = 0;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(s));
}

export function useHint() {
  const s = getState();
  s.hintsUsed = ((s.hintsUsed as number) || 0) + 1;
  if (typeof s.score !== 'number') s.score = 10000;
  s.score = Math.max(0, (s.score as number) - 50);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(s));
}

export function getScore(): number {
  return (getState().score as number) || 0;
}

export function getHintsUsed(): number {
  return (getState().hintsUsed as number) || 0;
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

export const BUG_TYPES: BugType[] = [
  { label: 'ERR_01', icon: '🐛', msg: 'Uncaught ReferenceError' },
  { label: 'ERR_02', icon: '💀', msg: 'Stack Overflow' },
  { label: 'ERR_03', icon: '⚠️', msg: 'undefined is not a function' },
  { label: 'ERR_404', icon: '👾', msg: 'Memory leak detected' },
  { label: 'ERR_NaN', icon: '🔥', msg: 'NaN at Elevator.js:404' },
  { label: 'ERR_NULL', icon: '🌀', msg: 'Null pointer exception' },
  { label: 'ERR_TYPE', icon: '💢', msg: 'TypeError: circular reference' },
];

export function generateSequence(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 4));
}

export function generateCircuitTarget(difficulty: number): number {
  return 50 + Math.floor(Math.random() * (30 - difficulty));
}

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
