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
