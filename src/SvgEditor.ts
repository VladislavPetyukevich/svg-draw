import { ActionCreator } from './Action';
import { StateChanger } from './State';
import { Element } from './Element';

type SvgEditor = (actionCreator: ActionCreator) => (actionParameters: Partial<Element>) => Element;

export const initializeSvgEditor = (stateChanger: StateChanger): SvgEditor =>
  (actionCreator: ActionCreator) => (actionParameters: Partial<Element>) =>
    actionCreator(stateChanger, actionParameters);
