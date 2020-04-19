import { State } from '../State';
import { Element, ElementType } from '../Element';

type StateToSvg = (document: Document, svgContainer: SVGSVGElement, stateToSvgMapper: SVGElementsCreator) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export type SVGElementsCreator = (document: Document, element: Element) => SVGElement;

export const stateToSvg: StateToSvg = (document: Document, svgContainer: SVGSVGElement, svgElementsCreator: SVGElementsCreator) => {
  let oldState: State;
  const elementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const changedElements = state.elements.filter((element) => {
      if (!oldState) {
        return true;
      }
      const oldElement = oldState.elements.find(oldEl => oldEl.id === element.id);
      if (!oldElement) {
        return true;
      }

      return !Object.keys(element).every((elementKey) => {
        const elementValue = element[elementKey as keyof Element];
        const oldElementValue = oldElement[elementKey as keyof Element];
        return elementValue === oldElementValue;
      });
    });
    const deletedElements = oldState && oldState.elements.filter(oldElement =>
      !state.elements.find(element => element.id === oldElement.id)
    );

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

    const updateElement = (element: SVGElement) => {
      const children = Array.from(elementsGroup.children);
      const oldElement = children.find(
        childEl => element.dataset.id === childEl.getAttribute('data-id')
      );
      if (!oldElement) {
        elementsGroup.appendChild(element);
        return;
      }
      elementsGroup.replaceChild(element, oldElement);
    };
    const deleteElement = (element: Element) => {
      const children = Array.from(elementsGroup.children);
      const targetDOMElement = children.find(
        childEl => `${element.id}` === childEl.getAttribute('data-id')
      );
      if (!targetDOMElement) {
        throw new Error('Element to delete not found in DOM');
      }
      elementsGroup.removeChild(targetDOMElement);
    };

    const newDomElements = changedElements.map(getDomElement);
    newDomElements.forEach(updateElement);
    if (deletedElements) {
      deletedElements.forEach(deleteElement);
    }
    oldState = state;
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
