import { SVGElementsCreator } from './StateToSvg';

export const rectCreator: SVGElementsCreator = (element) => {
  const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  newRect.setAttribute('x', `${element.x}`);
  newRect.setAttribute('y', `${element.y}`);
  newRect.setAttribute('width', `${element.width}`);
  newRect.setAttribute('height', `${element.height}`);
  newRect.setAttribute('fill', `${element.fill}`);
  return newRect;
};
