import { SVGElementsCreator } from './StateToSvg';
import { Element } from '@/Element';

export const commonPropertiesWrapper = (elementCreator: SVGElementsCreator) =>
  (element: Element) => {
    const newElement = elementCreator(element);
    if (element.domId) {
      newElement.setAttribute('id', `${element.domId}`);
    }
    if (element.class) {
      newElement.setAttribute('class', `${element.class}`);
    }
    if (element.fill) {
      newElement.setAttribute('fill', `${element.fill}`);
    }
    if (element.stroke) {
      newElement.setAttribute('stroke', `${element.stroke}`);
    }
    return newElement;
  };
