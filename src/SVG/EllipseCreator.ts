import { SVGElementsCreator } from './StateToSvg';

export const ellipseCreator: SVGElementsCreator = (element) => {
  if(!element.x || !element.y) {
    throw new Error('Element x or y are not specified');
  }
  if(!element.width || !element.height) {
    throw new Error('Element width or height are not specified');
  }
  const newEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  newEllipse.setAttribute('cx', `${element.x + element.width / 2}`);
  newEllipse.setAttribute('cy', `${element.y + element.height / 2}`);
  newEllipse.setAttribute('rx', `${element.width / 2}`);
  newEllipse.setAttribute('ry', `${element.height / 2}`);
  return newEllipse;
};
