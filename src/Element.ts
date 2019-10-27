export type ElementType = 'rect' | 'ellipse';

export interface Element {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
}
