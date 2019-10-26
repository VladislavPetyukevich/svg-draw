import { StateChanger, State, SetState } from './State';
import { Element } from './Element';

export type ActionCreator = (stateChanger: StateChanger, parameters: Partial<Element>) => Partial<Element>;

export type Action = (state: State, setState: SetState) => Partial<Element>;

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
