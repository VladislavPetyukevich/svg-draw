export type ElementType =
  'rect' |
  'ellipse' |
  'circle' |
  'line' |
  'polygon' |
  'polyline';

export interface Element {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: string;
  fill?: string;
  stroke?: string;
}
