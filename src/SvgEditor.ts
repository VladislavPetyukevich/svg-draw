import { ActionCreator } from './Action';
import { StateChanger } from './State';
import { Element } from './Element';

export type SvgEditorActionCreator = (actionParameters: Partial<Element>) => Element;
type SvgEditor = (actionCreator: ActionCreator) => SvgEditorActionCreator;

export const initializeSvgEditor = (stateChanger: StateChanger): SvgEditor =>
  (actionCreator: ActionCreator) => (actionParameters: Partial<Element>) =>
    actionCreator(stateChanger, actionParameters);
