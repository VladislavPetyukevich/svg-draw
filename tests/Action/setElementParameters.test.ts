import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { setElementParameters } from '../../src/Action';

describe('setElementParameters', () => {
  const setState = spy();
  const stateChanger = (action: Function) => {
    const state = {
      elements: [{ id: 0, type: 'test' }]
    };
    return action(state, setState);
  };

  beforeEach(() => {
    setState.resetHistory();
  });

  it('should throw element id exception', () => {
    expect(
      () => setElementParameters(stateChanger as any, {})
    ).throw('Element id is not specified');
  });

  it('should throw element not found exception', () => {
    const parameters = {
      id: 5
    };
    expect(
      () => setElementParameters(stateChanger as any, parameters as any)
    ).throw('Element not found');
  });

  it('should return element', () => {
    const parameters: Partial<Element> = {
      id: 0,
      x: 5
    };
    const result = setElementParameters(stateChanger as any, parameters);
    const expectedResult = { id: 0, type: 'test', x: 5 };
    expect(result).deep.equal(expectedResult);
  });

  it('should set element parameters', () => {
    const parameters: Partial<Element> = {
      id: 0,
      x: 1,
      y: 2,
      width: 3,
      height: 4
    };
    setElementParameters(stateChanger as any, parameters);
    const setStateChangerArgs = setState.getCalls().map(call => call.args);
    const expectedSetStateChangerArgs =
      [[{
        elements: [
          {
            id: 0,
            type: "test",
            x: 1,
            y: 2,
            width: 3,
            height: 4
          }
        ]
      }]];
    expect(expectedSetStateChangerArgs).deep.equal(setStateChangerArgs);
  });
});
