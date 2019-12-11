export type ElementType =
  'rect' |
  'ellipse' |
  'circle' |
  'line' |
  'polygon' |
  'polyline' |
  'group' |
  'text';

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
  text?: string;
  fontSize?: number;
}
