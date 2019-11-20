import { SVGElementsCreator } from './StateToSvg';

export const polylineCreator: SVGElementsCreator = () => {
  const newPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  return newPolyline;
};
