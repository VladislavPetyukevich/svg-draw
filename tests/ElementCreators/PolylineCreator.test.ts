import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { polylineCreator } from '../../src/SVG/PolylineCreator';

describe('PolylineCreator', () => {
  const setAttribute = spy();
  const sampleElement = { setAttribute };
  const createElementNS = spy(() => sampleElement);
  const document = { createElementNS };

  const element: Element = {
    id: 0,
    type: 'polyline',
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
    const result = polylineCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    polylineCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'polyline']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });
});
