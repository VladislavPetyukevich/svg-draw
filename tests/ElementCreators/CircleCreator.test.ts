import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { circleCreator } from '../../src/SVG/CircleCreator';

describe('CircleCreator', () => {
  const setAttribute = spy();
  const sampleElement = { setAttribute };
  const createElementNS = spy(() => sampleElement);
  const document = { createElementNS };

  const element: Element = {
    id: 0,
    type: 'circle',
    x: 10,
    y: 10,
    width: 10,
    height: 10
  };

  beforeEach(() => {
    setAttribute.resetHistory();
    createElementNS.resetHistory();
  });

  it('should return object', () => {
    const result = circleCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    circleCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'circle']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });

  it('should call setAttribute', () => {
    circleCreator(document as any, element);
    const expectedSetAttributeArgs = [['cx', '15'], ['cy', '15'], ['r', '5']];
    const setAttributeArgs = setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });
});
