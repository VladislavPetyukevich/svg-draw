import { SVGElementsCreator } from './StateToSvg';

export const polygonCreator: SVGElementsCreator = (document) => {
  const newPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  return newPolygon;
};
