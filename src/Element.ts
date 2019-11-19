export type ElementType =
  'rect' |
  'ellipse' |
  'circle' |
  'line';

export interface Element {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}
