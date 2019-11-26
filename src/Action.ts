import { StateChanger, State, SetState } from './State';
import { Element } from './Element';

export type ActionCreator = (stateChanger: StateChanger, parameters: Partial<Element>) => Element;

export type Action = (state: State, setState: SetState) => Element;

export const addElement = (stateChanger: StateChanger, parameters: Partial<Element>) =>
  stateChanger(
    (state: State, setState: SetState) => {
      let lastId = state.elements.length - 1;
      const createElement = (parameters: Partial<Element>): Element => {
        if (!parameters.type) {
          throw new Error('Element type is not specified');
        }
        lastId++;
        return {
          id: lastId,
          type: parameters.type,
          x: parameters.x || 0,
          y: parameters.y || 0,
          width: parameters.width || 0,
          height: parameters.height || 0,
          fill: parameters.fill,
          stroke: parameters.stroke,
          points: parameters.points,
          children: parameters.children
        };
      };
      const newElement = createElement(parameters);
      if (newElement.type === 'group') {
        if (!newElement.children) {
          throw new Error('Group children is not specified');
        }
        newElement.children = newElement.children.map(element => createElement(element));
      }
      setState({
        elements: [...state.elements, newElement]
      });
      return newElement;
    }
  );

export const setElementParameters = (stateChanger: StateChanger, parameters: Partial<Element>) =>
  stateChanger(
    (state: State, setState: SetState) => {
      if ((parameters.id !== 0) && !parameters.id) {
        throw new Error('Element id is not specified');
      }
      const targetElement = state.elements.find(element => element.id === parameters.id);
      if (!targetElement) {
        throw new Error('Element not found');
      }
      const changedElement = {
        ...targetElement,
        ...parameters,
      };
      const newStateElements = state.elements.map(element => (element.id === changedElement.id) ? changedElement : element);
      setState({
        elements: newStateElements
      });
      return changedElement;
    }
  );

export const addElementParameters = (stateChanger: StateChanger, parameters: Partial<Element>) =>
  stateChanger(
    (state: State, setState: SetState) => {
      if ((parameters.id !== 0) && !parameters.id) {
        throw new Error('Element id is not specified');
      }
      const targetElement = state.elements.find(element => element.id === parameters.id);
      if (!targetElement) {
        throw new Error('Element not found');
      }
      const addParameters = (element: Element, parameters: Partial<Element>) => {
        const changedElement = {
          ...element,
          ...(parameters.x && element.x && { x: element.x + parameters.x }),
          ...(parameters.y && element.y && { y: element.y + parameters.y }),
          ...(parameters.width && element.width && { width: element.width + parameters.width }),
          ...(parameters.height && element.height && { height: element.height + parameters.height }),
          ...(parameters.stroke && { stroke: parameters.stroke }),
          ...(parameters.fill && { fill: parameters.fill }),
        };
        return changedElement;
      }
      const changedElement = addParameters(targetElement, parameters);
      if (changedElement.children) {
        changedElement.children = changedElement.children.map(
          child => addParameters(child, parameters)
        );
      }
      const newStateElements = state.elements.map(element => (element.id === changedElement.id) ? changedElement : element);
      setState({
        elements: newStateElements
      });
      return changedElement;
    }
  );
