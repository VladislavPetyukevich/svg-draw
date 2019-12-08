import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { colorPropertiesWrapper } from '../../src/SVG/Wrapper/ColorPropertiesWrapper'

describe('ColorPropertiesWrapper', () => {
  const element: Element = {
    id: 0,
    type: 'circle',
    fill: 'white',
    stroke: 'black'
  };
  const domElement = {
    id: 'test',
    setAttribute: spy()
  };

  beforeEach(() => {
    domElement.setAttribute.resetHistory();
  });

  it('should return object', () => {
    const result = colorPropertiesWrapper(element)(domElement as any);
    expect(result).deep.equal(domElement);
  });

  it('should set fill and stroke properties', () => {
    colorPropertiesWrapper(element)(domElement as any);
    const expectedSetAttributeArgs = [['fill', 'white'], ['stroke', 'black']];
    const setAttributeArgs = domElement.setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });
});
