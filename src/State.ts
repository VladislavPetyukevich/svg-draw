import { Action } from './Action';
import { Element } from './Element';
import { StateToSvgChanger } from './SVG/StateToSvg';

export interface State {
  elements: Element[]
}

export type StateChanger = (action: Action) => Element;

export type SetState = (newState: State) => State;

export const initialState = (stateToSvgChanger?: StateToSvgChanger): StateChanger => {
  let state: State = {
    elements: []
  };

  const setState = (newState: State) => {
    if (stateToSvgChanger) {
      stateToSvgChanger(newState);
    }
    return state = newState;
  }

  return (stateAction: Action) =>
    stateAction(state, setState);
};