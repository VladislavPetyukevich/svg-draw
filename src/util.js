import ElementTransformer from './ElementTransformer';

export function roundTo(number, round) {
  return Math.round(number / round) * round;
}

export function nodeListToArray(nodesList) {
  return Array.prototype.slice.call(nodesList);
}

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

export function getEventCoordinates(event) {
  if (isVarExists(event.touches)) {
    return event.touches[0];
  }
  return event;
}

export function prepareSvgCodeToSave(svgEl, width, height) {
  var newSvgEl = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  newSvgEl.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
  newSvgEl.innerHTML = '<!-- Created with SVG-edit - http://someurl.com -->';
  newSvgEl.innerHTML += svgEl.innerHTML;

  var serializer = new XMLSerializer();
  var source = serializer.serializeToString(newSvgEl);

  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  return source;
}

export function isVarExists(variable) {
  return typeof variable !== 'undefined';
}
