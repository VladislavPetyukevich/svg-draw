import { SVGElementsCreator } from './StateToSvg';

export const circleCreator: SVGElementsCreator = (element) => {
  const newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  newCircle.setAttribute('cx', `${element.x + element.width / 2}`);
  newCircle.setAttribute('cy', `${element.y + element.height / 2}`);
  if (element.width !== element.height) {
    throw new Error('Circle width and height are not the same');
  }
  newCircle.setAttribute('r', `${element.width / 2}`);
  return newCircle;
};
