import { SVGElementsCreator } from './StateToSvg';

export const groupCreator: SVGElementsCreator = () => {
  const newGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  return newGroup;
};
