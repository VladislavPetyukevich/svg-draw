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
      const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      newRect.setAttribute('x', `${element.x}`);
      newRect.setAttribute('y', `${element.y}`);
      newRect.setAttribute('width', `${element.width}`);
      newRect.setAttribute('height', `${element.height}`);
      return newRect;
    case 'ellipse':
      const newEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      newEllipse.setAttribute('cx', `${element.x + element.width / 2}`);
      newEllipse.setAttribute('cy', `${element.y + element.height / 2}`);
      newEllipse.setAttribute('rx', `${element.width / 2}`);
      newEllipse.setAttribute('ry', `${element.height / 2}`);
      return newEllipse;
    default:
      throw new Error(`Unknown element type: ${element.type}`);
  }
};
