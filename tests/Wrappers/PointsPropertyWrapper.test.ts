import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { pointsPropertyWrapper } from '../../src/SVG/Wrapper/PointsPropertyWrapper'

describe('PointsPropertyWrapper', () => {
  const element: Element = {
    id: 0,
    type: 'polygon',
    x: 10,
    y: 20,
    width: 30,
    height: 40,
    points: '100,100 150,25 150,75,200,0'
  };
  const domElement = {
    id: 'test',
    setAttribute: spy()
  };

  beforeEach(() => {
    domElement.setAttribute.resetHistory();
  });

  it('should return object', () => {
    const result = pointsPropertyWrapper(element)(domElement as any);
    expect(result).deep.equal(domElement);
  });

  it('should set points property', () => {
    pointsPropertyWrapper(element)(domElement as any);
    const expectedSetAttributeArgs = [['points', '10,60,25,30,25,50,40,20']];
    const setAttributeArgs = domElement.setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });

  it('should throw points exception', () => {
    const incorrectElement = {};
    expect(
      () => pointsPropertyWrapper(incorrectElement as any)(domElement as any)
    ).throw('Element points are not specified');
  });

  it('should throw coordinates exception', () => {
    const incorrectElement = {
      points: '100,100 150,25 150,75,200,0'
    };
    expect(
      () => pointsPropertyWrapper(incorrectElement as any)(domElement as any)
    ).throw('Element x or y are not specified');
  });

  it('should throw size exception', () => {
    const incorrectElement = {
      x: 10,
      y: 20,
      points: '100,100 150,25 150,75,200,0'
    };
    expect(
      () => pointsPropertyWrapper(incorrectElement as any)(domElement as any)
    ).throw('Element width or height are not specified');
  });
});
