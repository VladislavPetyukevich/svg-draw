import { StateChanger, State, SetState } from './State';
import { Element } from './Element';

export type ActionCreator = (stateChanger: StateChanger, parameters: Partial<Element>) => Element;

export type Action = (state: State, setState: SetState) => Element;

export const addElement = (stateChanger: StateChanger, parameters: Partial<Element>) =>
  stateChanger(
    (state: State, setState: SetState) => {
      if (!parameters.type) {
        throw new Error('Element type is not specified');
      }
      const newElement: Element = {
        id: state.elements.length,
        type: parameters.type,
        x: parameters.x || 0,
        y: parameters.y || 0,
        width: parameters.width || 0,
        height: parameters.height || 0
      };
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
