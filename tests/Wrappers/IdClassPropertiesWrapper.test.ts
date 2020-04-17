import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { idClassPropertiesWrapper } from '../../src/SVG/Wrapper/IdClassPropertiesWrapper'

describe('IdClassPropertiesWrapper', () => {
  const element: Element = {
    id: 0,
    type: 'circle',
    domId: 'testDomId',
    class: 'testDomClass'
  };
  const domElement = {
    id: 'test',
    setAttribute: spy()
  };

  beforeEach(() => {
    domElement.setAttribute.resetHistory();
  });

  it('should return object', () => {
    const result = idClassPropertiesWrapper(element)(domElement as any);
    expect(result).deep.equal(domElement);
  });

  it('should set id, class and data-id properties', () => {
    idClassPropertiesWrapper(element)(domElement as any);
    const expectedSetAttributeArgs = [['id', 'testDomId'], ['class', 'testDomClass'], ['data-id', '0']];
    const setAttributeArgs = domElement.setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });
});
