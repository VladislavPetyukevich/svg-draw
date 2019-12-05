import { SVGElementsCreator } from './StateToSvg';

export const rectCreator: SVGElementsCreator = (element) => {
  if ((typeof element.x !== 'number') || (typeof element.y !== 'number')) {
    throw new Error('Element x or y are not specified');
  }
  if ((typeof element.width !== 'number') || (typeof element.height !== 'number')) {
    throw new Error('Element width or height are not specified');
  }
  const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  newRect.setAttribute('x', `${element.x}`);
  newRect.setAttribute('y', `${element.y}`);
  newRect.setAttribute('width', `${element.width}`);
  newRect.setAttribute('height', `${element.height}`);
  return newRect;
};
