import { State } from '@/State';
import { Element, ElementType } from '@/Element';

type StateToSvg = (svgContainer: SVGSVGElement, stateToSvgMapper: SVGElementsCreator) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export type SVGElementsCreator = (element: Element) => SVGElement;

export const stateToSvg: StateToSvg = (svgContainer: SVGSVGElement, svgElementsCreator: SVGElementsCreator) => {
  const elementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const getDomElement = (element: Element): SVGElement => {
      const domElement = svgElementsCreator(element);
      if (element.children) {
        element.children.forEach(
          child => domElement.appendChild(svgElementsCreator(child))
        );
      }
      return domElement;
    }

    const domElements = state.elements.map(getDomElement);
    const elementsGroupInnerHTML = domElements.reduce(
      (innerHTML, element) => innerHTML += element.outerHTML,
      ''
    );
    elementsGroup.innerHTML = elementsGroupInnerHTML;
  };
};

type CombineSVGElementCreators = {
  [key in ElementType]: SVGElementsCreator;
};

export const combineSVGElementCreators = (props: CombineSVGElementCreators): SVGElementsCreator =>
  (element: Element) => {
    if (!props[element.type]) {
      throw new Error(`Unknown element type: ${element.type}`);
    }
    return props[element.type](element);
  };
