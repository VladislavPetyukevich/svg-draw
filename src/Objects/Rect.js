import ElementTransformer from '../ElementTransformer';
import Coordinates from '../DataStructures/Coordinates';

var Rect = new Object();

Rect.translate = function (x, y) {
  this.setAttribute('x', Number(this.getAttribute('x')) + x);
  this.setAttribute('y', Number(this.getAttribute('y')) + y);
  var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
  if (rotate != undefined) {
    ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
  }
  return this;
}

Rect.getPosition = function () {
  return {
    x: Number(this.getAttribute('x')),
    y: Number(this.getAttribute('y'))
  }
}

Rect.getSize = function () {
  return {
    width: Number(this.getAttribute('width')),
    height: Number(this.getAttribute('height'))
  }
}

Rect.setPosition = function (x, y) {
  this.setAttribute('x', x);
  this.setAttribute('y', y);
  return this;
}

Rect.setSize = function (width, height) {
  this.setAttribute('width', width);
  this.setAttribute('height', height);
  return this;
}

Rect.scale = function (width, height) {
  this.setAttribute('width', Number(this.getAttribute('width')) * width);
  this.setAttribute('height', Number(this.getAttribute('height')) * height);
  return this;
}

Rect.rotate = function (angle) {
  var elPos = this.getPosition();
  var elSize = this.getSize();
  var centerCoordinates = new Coordinates(
    elPos.x + elSize.width / 2,
    elPos.y + elSize.height / 2
  );
  ElementTransformer.rotate(this, centerCoordinates, angle);
  return this;
}

export default Rect;
