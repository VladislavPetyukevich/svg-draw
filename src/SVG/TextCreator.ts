import { SVGElementsCreator } from './StateToSvg';

export const textCreator: SVGElementsCreator = (document, element) => {
  const newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  if ((typeof element.x !== 'number') || (typeof element.y !== 'number')) {
    throw new Error('Element x or y are not specified');
  }
  if (typeof element.text !== 'string') {
    throw new Error('Element text are not specified');
  }
  if (typeof element.fontSize !== 'number') {
    throw new Error('Element font size are not specified');
  }
  newText.setAttribute('x', `${element.x}`);
  newText.setAttribute('y', `${element.y}`);
  const innerText = document.createTextNode(element.text);
  newText.appendChild(innerText);
  newText.setAttribute('font-size', `${element.fontSize}`);
  return newText;
};
