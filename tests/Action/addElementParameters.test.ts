import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { addElementParameters } from '../../src/Action';

describe('addElementParameters', () => {
  const setState = spy();
  const stateChanger = (action: Function) => {
    const state = {
      elements: [
        {
          id: 0,
          type: 'test',
          x: 1,
          y: 2
        },
        {
          id: 1,
          type: "test",
          children: [
            { id: 2, type: "test", x: 2, y: 2 },
            { id: 3, type: "test", x: 3, y: 3 }
          ]
        }
      ]
    };
    return action(state, setState);
  };

  beforeEach(() => {
    setState.resetHistory();
  });

  it('should throw element id exception', () => {
    expect(
      () => addElementParameters(stateChanger as any, {})
    ).throw('Element id is not specified');
  });

  it('should throw element not found exception', () => {
    const parameters: Partial<Element> = {
      id: 5
    };
    expect(
      () => addElementParameters(stateChanger as any, parameters)
    ).throw('Element not found');
  });

  it('should return element', () => {
    const parameters: Partial<Element> = {
      id: 0,
      x: 5,
      y: 6
    };
    const result = addElementParameters(stateChanger as any, parameters);
    const expectedResult = { id: 0, type: 'test', x: 6, y: 8 };
    expect(result).deep.equal(expectedResult);
  });

  it('should should add element parameters', () => {
    const parameters: Partial<Element> = {
      id: 0,
      x: 5,
      y: 6
    };
    addElementParameters(stateChanger as any, parameters);
    const setStateChangerArgs = setState.getCalls().map(call => call.args);
    const expectedSetStateChangerArgs =
      [[{
        elements: [
          { id: 0, type: "test", x: 6, y: 8 },
          {
            id: 1, type: "test", children: [
              { id: 2, type: "test", x: 2, y: 2 },
              { id: 3, type: "test", x: 3, y: 3 }
            ]
          }
        ]
      }]];
    expect(expectedSetStateChangerArgs).deep.equal(setStateChangerArgs);
  });

  it('should should add group element parameters', () => {
    const parameters: Partial<Element> = {
      id: 1,
      x: 5,
      y: 6
    };
    addElementParameters(stateChanger as any, parameters);
    const setStateChangerArgs = setState.getCalls().map(call => call.args);
    const expectedSetStateChangerArgs =
      [[{
        elements: [
          { id: 0, type: "test", x: 1, y: 2 },
          {
            id: 1, type: "test", children: [
              { id: 2, type: "test", x: 7, y: 8 },
              { id: 3, type: "test", x: 8, y: 9 }
            ]
          }
        ]
      }]]
    expect(expectedSetStateChangerArgs).deep.equal(setStateChangerArgs);
  });
});
