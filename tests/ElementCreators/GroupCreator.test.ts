import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { groupCreator } from '../../src/SVG/GroupCreator';

describe('GroupCreator', () => {
  const setAttribute = spy();
  const sampleElement = { setAttribute };
  const createElementNS = spy(() => sampleElement);
  const document = { createElementNS };

  const element: Element = {
    id: 0,
    type: 'group'
  };

  beforeEach(() => {
    setAttribute.resetHistory();
    createElementNS.resetHistory();
  });

  it('should return object', () => {
    const result = groupCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    groupCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'g']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });
});
