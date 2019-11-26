export type ElementType =
  'rect' |
  'ellipse' |
  'circle' |
  'line' |
  'polygon' |
  'polyline' |
  'group';

export interface Element {
  id: number;
  type: ElementType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: string;
  children?: Element[];
  fill?: string;
  stroke?: string;
}
