import { Element } from '@/Element';
import { Wrapper } from './Wrap';

export const idClassPropertiesWrapper: Wrapper = (element: Element) =>
  (domElement: SVGElement) => {
    if (element.domId) {
      domElement.setAttribute('id', `${element.domId}`);
    }
    if (element.class) {
      domElement.setAttribute('class', `${element.class}`);
    }
    return domElement;
  };
