import { expect } from 'chai';
import { spy } from 'sinon';
import { Element } from '../../src/Element';
import { textCreator } from '../../src/SVG/TextCreator';

describe('TextCreator', () => {
  const setAttribute = spy();
  const sampleElementAppendChild = spy(() => { });
  const sampleElement = { setAttribute, appendChild: sampleElementAppendChild };
  const createElementNS = spy(() => sampleElement);
  const sampleTextNode = { testNode: 'testNode' };
  const createTextNode = spy(() => sampleTextNode);
  const document = { createElementNS, createTextNode };

  const element: Element = {
    id: 0,
    type: 'text',
    x: 10,
    y: 20,
    text: 'sample text',
    fontSize: 15
  };

  beforeEach(() => {
    setAttribute.resetHistory();
    createElementNS.resetHistory();
    createTextNode.resetHistory();
    sampleElementAppendChild.resetHistory();
  });

  it('should return object', () => {
    const result = textCreator(document as any, element);
    expect(result).deep.equal(sampleElement);
  });

  it('should call createElementNS', () => {
    textCreator(document as any, element);
    const expectedCreateElementArgs = [['http://www.w3.org/2000/svg', 'text']];
    const createElementArgs = createElementNS.getCalls().map(call => call.args);
    expect(expectedCreateElementArgs).deep.equal(createElementArgs);
  });

  it('should call setAttribute', () => {
    textCreator(document as any, element);
    const expectedSetAttributeArgs = [
      ['x', '10'],
      ['y', '20'],
      ['font-size', '15']
    ];
    const setAttributeArgs = setAttribute.getCalls().map(call => call.args);
    expect(expectedSetAttributeArgs).deep.equal(setAttributeArgs);
  });

  it('should append text child', () => {
    textCreator(document as any, element);
    const createTextNodeArgs = createTextNode.getCalls().map(call => call.args);
    const expectedCreateTextNodeArgs = [['sample text']];
    expect(createTextNodeArgs).deep.equal(expectedCreateTextNodeArgs);
    const sampleElementAppendChildArgs = sampleElementAppendChild.getCalls().map(call => call.args);
    const expectedSampleElementAppendChildArgs = [[sampleTextNode]];
    expect(sampleElementAppendChildArgs).deep.equal(expectedSampleElementAppendChildArgs);
  });

  it('should throw coordinates exception', () => {
    const incorrectElement = {};
    expect(
      () => textCreator(document as any, incorrectElement as any)
    ).throw('Element x or y are not specified');
  });

  it('should throw text exception', () => {
    const incorrectElement = { x: 1, y: 1 };
    expect(
      () => textCreator(document as any, incorrectElement as any)
    ).throw('Element text are not specified');
  });

  it('should throw font size exception', () => {
    const incorrectElement = { x: 1, y: 1, text: 'text' };
    expect(
      () => textCreator(document as any, incorrectElement as any)
    ).throw('Element font size are not specified');
  });
});
