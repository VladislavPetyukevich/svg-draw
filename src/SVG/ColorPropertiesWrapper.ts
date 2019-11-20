import { SVGElementsCreator } from './StateToSvg';
import { Element } from '@/Element';

export const colorPropertiesWrapper = (elementCreator: SVGElementsCreator) =>
  (element: Element) => {
    const newElement = elementCreator(element);
    if (element.fill) {
      newElement.setAttribute('fill', `${element.fill}`);
    }
    if (element.stroke) {
      newElement.setAttribute('stroke', `${element.stroke}`);
    }
    return newElement;
  };
