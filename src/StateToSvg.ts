import { State } from './State';

type StateToSvg = (svgContainer: SVGElement) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export const stateToSvg: StateToSvg = (svgContainer: SVGElement) => {
  const elementsGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const domElements = state.elements.map(
      (element) => {
        switch (element.type) {
          case 'rect':
            const newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            newElement.setAttribute('x', `${element.x}`);
            newElement.setAttribute('y', `${element.y}`);
            newElement.setAttribute('width', `${element.width}`);
            newElement.setAttribute('height', `${element.height}`);
            return newElement;
        }
      }
    );
    const elementsGroupInnerHTML = domElements.reduce(
      (innerHTML, element) => innerHTML += element.outerHTML,
      ''
    );
    elementsGroup.innerHTML = elementsGroupInnerHTML;
  };
};
