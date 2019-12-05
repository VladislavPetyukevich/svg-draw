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
  domId?: string;
  class?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  points?: string;
  children?: Partial<Element>[];
  fill?: string;
  stroke?: string;
}
