import { Element } from '../../Element';
import { Wrapper } from './Wrap';

export const colorPropertiesWrapper: Wrapper = (element: Element) =>
  (domElement: SVGElement) => {
    if (element.fill) {
      domElement.setAttribute('fill', `${element.fill}`);
    }
    if (element.stroke) {
      domElement.setAttribute('stroke', `${element.stroke}`);
    }
    return domElement;
  };
