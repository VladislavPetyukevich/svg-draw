import { SVGElementsCreator } from './StateToSvg';
import { Element } from '@/Element';

export const commonFieldsWrapper = (elementCreator: SVGElementsCreator) =>
  (element: Element) => {
    const newElement = elementCreator(element);;
    newElement.setAttribute('fill', `${element.fill}`);
    return newElement;
  };
