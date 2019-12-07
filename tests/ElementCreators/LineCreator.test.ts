import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { lineCreator } from '../../src/SVG/LineCreator';

describe('LineCreator', () => {
  const setAttribute = spy();
  const sampleElement = { setAttribute };
  const createElementNS = spy(() => sampleElement);
  const document = { createElementNS };

  const element: Element = {
    id: 0,
    type: 'line',
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
    const result = lineCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    lineCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'line']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });

  it('should call setAttribute', () => {
    lineCreator(document as any, element);
    const expectedSetAttributeArgs = [
      ['x1', '10'],
      ['y1', '10'],
      ['x2', '20'],
      ['y2', '20'],
      ['stroke', 'black']
    ];
    const setAttributeArgs = setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });
});
