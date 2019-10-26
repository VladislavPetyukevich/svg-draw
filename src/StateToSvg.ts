import { State } from './State';
import { Element } from './Element';

type StateToSvg = (svgContainer: SVGElement, stateToSvgMapper: StateToSvgMapper) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export type StateToSvgMapper = (element: Element) => SVGElement;

export const stateToSvg: StateToSvg = (svgContainer: SVGElement, stateToSvgMapper: StateToSvgMapper) => {
  const elementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const domElements = state.elements.map(stateToSvgMapper);
    const elementsGroupInnerHTML = domElements.reduce(
      (innerHTML, element) => innerHTML += element.outerHTML,
      ''
    );
    elementsGroup.innerHTML = elementsGroupInnerHTML;
  };
};

export const stateToSvgMapper: StateToSvgMapper = (element: Element) => {
  switch (element.type) {
    case 'rect':
      const newElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      newElement.setAttribute('x', `${element.x}`);
      newElement.setAttribute('y', `${element.y}`);
      newElement.setAttribute('width', `${element.width}`);
      newElement.setAttribute('height', `${element.height}`);
      return newElement;
  }
};
