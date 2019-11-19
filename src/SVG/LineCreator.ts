import { SVGElementsCreator } from './StateToSvg';

export const lineCreator: SVGElementsCreator = (element) => {
  const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  newLine.setAttribute('x1', `${element.x}`);
  newLine.setAttribute('y1', `${element.y}`);
  newLine.setAttribute('x2', `${element.x + element.width}`);
  newLine.setAttribute('y2', `${element.y + element.height}`);
  newLine.setAttribute('stroke', 'black');
  return newLine;
};
