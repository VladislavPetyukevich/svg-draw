import { StateChanger, State, SetState } from './State';
import { Element } from './Element';

export type ActionCreator = (stateChanger: StateChanger, parameters: Partial<Element>) => Partial<Element>;

export type Action = (state: State, setState: SetState) => Partial<Element>;

export const addRect = (stateChanger: StateChanger, parameters: Partial<Element>) =>
  stateChanger(
    (state: State, setState: SetState) => {
      const newElement: Element = {
        id: state.elements.length,
        type: 'rect',
        x: parameters.x!,
        y: parameters.y!,
        width: parameters.width!,
        height: parameters.height!
      };
      setState({
        elements: [...state.elements, newElement]
      });
      return newElement;
    }
  );
