import ElementTransformer from './ElementTransformer';

export function rotateVector(vector, angle) {
  var theta = angle * 0.017453292519943295; // (angle / 180) * Math.PI;
  var cos = Math.cos(theta);
  var sin = Math.sin(theta);
  var nx = vector.x * cos - vector.y * sin;
  var ny = vector.x * sin + vector.y * cos;
  return {
    x: parseFloat(nx.toFixed(5)),
    y: parseFloat(ny.toFixed(5))
  }
}

function getElementAttributes(el) {
  var bodyBoundingClientRect = document.body.getBoundingClientRect();
  var boundingClientRect = el.getBoundingClientRect();
  var attributes = {};
  attributes.y = boundingClientRect.top - bodyBoundingClientRect.top;
  attributes.x = boundingClientRect.left - bodyBoundingClientRect.left;
  attributes.width = boundingClientRect.width;
  attributes.height = boundingClientRect.height;
  return attributes;
}

export function getElementNoRotateAttributes(el) {
  var elCopy = el.cloneNode();
  ElementTransformer.removeTransformAttribute(elCopy, 'rotate');
  elCopy.style.visibility = 'hidden';
  elCopy.innerHTML = el.innerHTML;
  el.parentNode.appendChild(elCopy);
  var attributes = getElementAttributes(elCopy);
  el.parentNode.removeChild(elCopy);
  return attributes;
}
