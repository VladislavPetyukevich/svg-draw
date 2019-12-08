import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { ellipseCreator } from '../../src/SVG/EllipseCreator';

describe('EllipseCreator', () => {
  const setAttribute = spy();
  const sampleElement = { setAttribute };
  const createElementNS = spy(() => sampleElement);
  const document = { createElementNS };

  const element: Element = {
    id: 0,
    type: 'ellipse',
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
    const result = ellipseCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    ellipseCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'ellipse']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });

  it('should call setAttribute', () => {
    ellipseCreator(document as any, element);
    const expectedSetAttributeArgs = [['cx', '15'], ['cy', '15'], ['rx', '5'], ['ry', '5']];
    const setAttributeArgs = setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });

  it('should throw coordinates exception', () => {
    const incorrectElement = {};
    expect(
      () => ellipseCreator(document as any, incorrectElement as any)
    ).throw('Element x or y are not specified');
  });

  it('should throw size exception', () => {
    const incorrectElement = {
      x: 10,
      y: 10
    };
    expect(
      () => ellipseCreator(document as any, incorrectElement as any)
    ).throw('Element width or height are not specified');
  });
});
