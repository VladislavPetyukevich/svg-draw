import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { addElement } from '../../src/Action';

describe('addElement', () => {
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

  it('should throw element type exception', () => {
    expect(
      () => addElement(stateChanger as any, {})
    ).throw('Element type is not specified');
  });

  it('should throw group children exception', () => {
    const parameters = {
      type: 'group'
    };
    expect(
      () => addElement(stateChanger as any, parameters as any)
    ).throw('Group children is not specified');
  });

  it('should return element', () => {
    const parameters = { type: 'test' };
    const result = addElement(stateChanger as any, parameters as any);
    const expectedResult = {
      children: undefined,
      class: undefined,
      domId: undefined,
      fill: undefined,
      fontSize: undefined,
      text: undefined,
      height: 0,
      id: 1,
      points: undefined,
      stroke: undefined,
      type: "test",
      width: 0,
      x: 0,
      y: 0
    };
    expect(expectedResult).deep.equal(result);
  });

  it('should add element', () => {
    const parameters: Partial<Element> = {
      type: 'rect',
      x: 1,
      y: 2,
      width: 3,
      height: 4
    };
    addElement(stateChanger as any, parameters);
    const setStateChangerArgs = setState.getCalls().map(call => call.args);
    const expectedSetStateChangerArgs =
      [[{
        elements: [
          { id: 0, type: "test" },
          {
            id: 1,
            type: "rect",
            x: 1,
            y: 2,
            width: 3,
            height: 4,
            children: undefined,
            class: undefined,
            domId: undefined,
            fill: undefined,
            points: undefined,
            stroke: undefined,
            fontSize: undefined,
            text: undefined
          }
        ]
      }]];
    expect(expectedSetStateChangerArgs).deep.equal(setStateChangerArgs);
  });
});
