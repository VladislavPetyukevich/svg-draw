import { Action } from './Action';
import { Element } from './Element';

export interface State {
  elements: Element[]
}

export type StateChanger = (action: Action) => Partial<Element>;

export type SetState = (newState: State) => State;

export const initialState = (): StateChanger => {
  let state: State = {
    elements: []
  };

  const setState = (newState: State) => state = newState;

  return (stateAction: Action) =>
    stateAction(state, setState);
};