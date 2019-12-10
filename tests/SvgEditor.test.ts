import { expect } from 'chai';
import { spy } from 'sinon';
import { initializeSvgEditor } from '../src/SvgEditor';

describe('initializeSvgEditor', () => {
  const newState = { test: 'test' };
  const stateChanger = spy((newState) => { });
  const actionCreator = (stateChanger: Function, actionParameters: Function) => {
    stateChanger(newState);
    return actionParameters;
  };
  const actionParameters = { id: 1 };

  beforeEach(() => {
    stateChanger.resetHistory();
  });

  it('should return action creator result', () => {
    const result = initializeSvgEditor(stateChanger as any)(actionCreator as any)(actionParameters);
    expect(result).deep.equal(actionParameters)
  });

  it('should pass stateChanger to actionCreator', () => {
    initializeSvgEditor(stateChanger as any)(actionCreator as any)(actionParameters);
    const stateChangerArgs = stateChanger.getCalls().map(call => call.args);
    const expectedStateChangerArgs = [[newState]];
    expect(stateChangerArgs).deep.equal(expectedStateChangerArgs);
  });
});
