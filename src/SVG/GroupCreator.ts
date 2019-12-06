import { SVGElementsCreator } from './StateToSvg';

export const groupCreator: SVGElementsCreator = (document) => {
  const newGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  return newGroup;
};
