export type ElementType = 'rect' | 'ellipse' | 'path';

export interface Element {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  path?: string;
}
