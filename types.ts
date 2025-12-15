export enum PipeColor {
  GRAY = '#71717a',
  WHITE = '#f4f4f5',
  BLUE = '#3b82f6',
  ORANGE = '#f97316',
  GREEN = '#22c55e',
  RED = '#ef4444',
  BLACK = '#18181b',
  YELLOW = '#eab308'
}

export interface PipeDimensions {
  outerDiameter: number; // in mm
  wallThickness: number; // in mm
  length: number; // in mm
}

export interface PipeState extends PipeDimensions {
  color: string; // Changed to string to support any hex color
}

export const MIN_DIAMETER = 50;
export const MAX_DIAMETER = 300;
export const MIN_THICKNESS = 2;
export const MAX_THICKNESS = 15;
export const MIN_LENGTH = 500;
export const MAX_LENGTH = 6000;