import { SVGElementsCreator } from './StateToSvg';

export const ellipseCreator: SVGElementsCreator = (element) => {
  const newEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  newEllipse.setAttribute('cx', `${element.x + element.width / 2}`);
  newEllipse.setAttribute('cy', `${element.y + element.height / 2}`);
  newEllipse.setAttribute('rx', `${element.width / 2}`);
  newEllipse.setAttribute('ry', `${element.height / 2}`);
  return newEllipse;
};
