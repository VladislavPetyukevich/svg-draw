import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { rectCreator } from '../../src/SVG/RectCreator';

describe('RectCreator', () => {
  const setAttribute = spy();
  const sampleElement = { setAttribute };
  const createElementNS = spy(() => sampleElement);
  const document = { createElementNS };

  const element: Element = {
    id: 0,
    type: 'rect',
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
    const result = rectCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    rectCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'rect']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });

  it('should call setAttribute', () => {
    rectCreator(document as any, element);
    const expectedSetAttributeArgs = [
      ['x', '10'],
      ['y', '10'],
      ['width', '10'],
      ['height', '10']
    ];
    const setAttributeArgs = setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });
});
