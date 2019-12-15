import { State } from '@/State';
import { Element, ElementType } from '@/Element';

type StateToSvg = (document: Document, svgContainer: SVGSVGElement, stateToSvgMapper: SVGElementsCreator) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export type SVGElementsCreator = (document: Document, element: Element) => SVGElement;

export const stateToSvg: StateToSvg = (document: Document, svgContainer: SVGSVGElement, svgElementsCreator: SVGElementsCreator) => {
  let elementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const getDomElement = (element: Element): SVGElement => {
      const domElement = svgElementsCreator(document, element);
      if (element.children) {
        element.children.forEach(child => {
          if (!child.id && child.id !== 0) {
            throw new Error('Child id are not defined');
          }
          if (!child.type) {
            throw new Error('Child type are not defined');
          }
          return domElement.appendChild(svgElementsCreator(document, child as Element))
        });
      }
      return domElement;
    }

    const domElements = state.elements.map(getDomElement);
    let newElementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    domElements.forEach(element => newElementsGroup.appendChild(element));
    svgContainer.removeChild(elementsGroup);
    svgContainer.appendChild(newElementsGroup);
    elementsGroup = newElementsGroup;
  };
};

type CombineSVGElementCreators = {
  [key in ElementType]: SVGElementsCreator;
};

export const combineSVGElementCreators = (props: CombineSVGElementCreators): SVGElementsCreator =>
  (document: Document, element: Element) => {
    if (!props[element.type]) {
      throw new Error(`Unknown element type: ${element.type}`);
    }
    return props[element.type](document, element);
  };
