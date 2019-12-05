import { SVGElementsCreator } from './StateToSvg';

export const lineCreator: SVGElementsCreator = (element) => {
  if ((typeof element.x !== 'number') || (typeof element.y !== 'number')) {
    throw new Error('Element x or y are not specified');
  }
  if ((typeof element.width !== 'number') || (typeof element.height !== 'number')) {
    throw new Error('Element width or height are not specified');
  }
  const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  newLine.setAttribute('x1', `${element.x}`);
  newLine.setAttribute('y1', `${element.y}`);
  newLine.setAttribute('x2', `${element.x + element.width}`);
  newLine.setAttribute('y2', `${element.y + element.height}`);
  newLine.setAttribute('stroke', 'black');
  return newLine;
};
