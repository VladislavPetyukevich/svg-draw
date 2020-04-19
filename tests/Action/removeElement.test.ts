import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { addElement, removeElement } from '../../src/Action';

describe('removeElement', () => {
  const setState = spy();
  const sampleStateElement = { id: 0, type: 'test' };
  const stateChanger = (action: Function) => {
    const state = {
      elements: [sampleStateElement]
    };
    return action(state, setState);
  };

  beforeEach(() => {
    setState.resetHistory();
  });

  it('should throw element id exception', () => {
    expect(
      () => removeElement(stateChanger as any, {})
    ).throw('Element id are not defined');
  });

  it('should return element', () => {
    const result = removeElement(stateChanger as any, sampleStateElement as any);
    expect(sampleStateElement).deep.equal(result);
  });

  it('should delete element', () => {
    const parameters: Partial<Element> = {
      type: 'rect',
      x: 1,
      y: 2,
      width: 3,
      height: 4
    };
    const addedElement = addElement(stateChanger as any, parameters);
    removeElement(stateChanger as any, addedElement);
    const setStateChangerArgs = setState.getCalls().map(call => call.args);
    const expectedSetStateChangerArgs =
      [[
        { elements: [sampleStateElement, addedElement] }
      ], [
        { elements: [sampleStateElement] }
      ]];
    expect(expectedSetStateChangerArgs).deep.equal(setStateChangerArgs);
  });
});
