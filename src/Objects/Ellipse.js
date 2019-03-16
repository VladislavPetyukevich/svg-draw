import ElementTransformer from '../ElementTransformer';

var Ellipse = new Object();

Ellipse.translate = function (x, y) {
  this.setAttribute('cx', Number(this.getAttribute('cx')) + x);
  this.setAttribute('cy', Number(this.getAttribute('cy')) + y);
  var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
  if (rotate != undefined) {
    ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
  }
  return this;
}

Ellipse.getPosition = function () {
  var cx = Number(this.getAttribute('cx'));
  var cy = Number(this.getAttribute('cy'));
  var rx = Number(this.getAttribute('rx'));
  var ry = Number(this.getAttribute('ry'));
  return {
    x: cx - rx,
    y: cy - ry
  }
}

Ellipse.getSize = function () {
  return {
    width: Number(this.getAttribute('rx')) * 2,
    height: Number(this.getAttribute('ry')) * 2
  }
}

Ellipse.setPosition = function (x, y) {
  var oldPos = this.getPosition();
  var dx = x - oldPos.x;
  var dy = y - oldPos.y;
  this.translate(dx, dy);
  return this;
}

Ellipse.setSize = function (width, height) {
  var oldSize = this.getSize();
  this.scale(width / oldSize.width, height / oldSize.height);
  return this;
}

Ellipse.scale = function (width, height) {
  var cx = Number(this.getAttribute('cx'));
  var cy = Number(this.getAttribute('cy'));
  var rx = Number(this.getAttribute('rx'));
  var ry = Number(this.getAttribute('ry'));
  var diffWidth = rx - rx * width;
  var diffHeight = ry - ry * height;
  this.setAttribute('rx', rx * width);
  this.setAttribute('ry', ry * height);
  this.setAttribute('cx', cx - diffWidth);
  this.setAttribute('cy', cy - diffHeight);
  return this;
}

Ellipse.rotate = function (angle) {
  var elPos = this.getPosition();
  var elSize = this.getSize();
  var centerX = elPos.x + elSize.width / 2;
  var centerY = elPos.y + elSize.height / 2;
  ElementTransformer.setTransformAttribute(this, 'rotate', angle + ' ' + centerX + ' ' + centerY);
  return this;
}

export default Ellipse;
