import { SVGElementsCreator } from './StateToSvg';
import { Element } from '@/Element';

export const commonFieldsWrapper = (elementCreator: SVGElementsCreator) =>
  (element: Element) => {
    const newElement = elementCreator(element);;
    newElement.setAttribute('fill', `${element.fill}`);
    if (element.stroke) {
      newElement.setAttribute('stroke', `${element.stroke}`);
    }
    return newElement;
  };
