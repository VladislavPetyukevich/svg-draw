import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { wrap, Wrapper } from '../../src/SVG/Wrapper/Wrap';
import { polygonCreator } from '../../src/SVG/PolygonCreator';

describe('Wrap', () => {
  const sampleDomElement = {
    id: 1234
  };
  const sampleWrapper: Wrapper = (element: Element) => (domElement: SVGElement) => (sampleDomElement as any);
  const spyWrapper = spy(sampleWrapper);
  const document = {
    createElementNS: () => { }
  };
  const element: Element = {
    id: 0,
    type: 'polygon'
  };

  beforeEach(() => {
    spyWrapper.resetHistory();
  });

  it('should return dom element', () => {
    const result = wrap(
      polygonCreator,
      [spyWrapper, spyWrapper, spyWrapper]
    )(document as any, element);
    expect(result).deep.equal(sampleDomElement);
  });

  it('should call wrappers', () => {
    wrap(
      polygonCreator,
      [spyWrapper, spyWrapper, spyWrapper]
    )(document as any, element);
    const spyWrapperArgs = spyWrapper.getCalls().map(call => call.args);
    const expectedAgrs = [
      [{ id: 0, type: 'polygon' }],
      [{ id: 0, type: 'polygon' }],
      [{ id: 0, type: 'polygon' }]
    ];
    expect(expectedAgrs).deep.equal(spyWrapperArgs);
  });
});
