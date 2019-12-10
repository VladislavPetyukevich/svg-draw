import { expect } from 'chai';
import { spy } from 'sinon';
import { initialState } from '../src/State';

describe('InitialState', () => {
  const stateToSvgChanger = spy(() => { });
  const newState = { elements: [{ test: 'test' }] };
  const actionElement = { id: 1 };
  const stateAction = (state: Function, setState: Function) => {
    setState(newState);
    return actionElement;
  };

  beforeEach(() => {
    stateToSvgChanger.resetHistory();
  });

  it('should return element from action', () => {
    const result = initialState(stateToSvgChanger)(stateAction as any);
    expect(result).deep.equal(actionElement);
  });

  it('should pass setState to action', () => {
    initialState(stateToSvgChanger)(stateAction as any);
    const setStateArgs = stateToSvgChanger.getCalls().map(call => call.args);
    const expectedSetStateArgs = [[newState]];
    expect(setStateArgs).deep.equal(expectedSetStateArgs);
  });
});
