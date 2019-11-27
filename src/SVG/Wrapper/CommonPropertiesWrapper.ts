import { Element } from '@/Element';
import { Wrapper } from './Wrap';

export const commonPropertiesWrapper: Wrapper = (element: Element) =>
  (domElement: SVGElement) => {
    if (element.domId) {
      domElement.setAttribute('id', `${element.domId}`);
    }
    if (element.class) {
      domElement.setAttribute('class', `${element.class}`);
    }
    if (element.fill) {
      domElement.setAttribute('fill', `${element.fill}`);
    }
    if (element.stroke) {
      domElement.setAttribute('stroke', `${element.stroke}`);
    }
    return domElement;
  };
