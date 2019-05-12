import ElementTransformer from '../ElementTransformer';
import Coordinates from '../DataStructures/Coordinates';

const Rect = {
  translate: function (x, y) {
    this.setAttribute('x', Number(this.getAttribute('x')) + x);
    this.setAttribute('y', Number(this.getAttribute('y')) + y);
    const rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
    if (rotate != undefined) {
      ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
    }
    return this;
  },

  getPosition: function () {
    return {
      x: Number(this.getAttribute('x')),
      y: Number(this.getAttribute('y'))
    }
  },

  getSize: function () {
    return {
      width: Number(this.getAttribute('width')),
      height: Number(this.getAttribute('height'))
    }
  },

  setPosition: function (x, y) {
    this.setAttribute('x', x);
    this.setAttribute('y', y);
    return this;
  },

  setSize: function (width, height) {
    this.setAttribute('width', width);
    this.setAttribute('height', height);
    return this;
  },

  scale: function (width, height) {
    this.setAttribute('width', Number(this.getAttribute('width')) * width);
    this.setAttribute('height', Number(this.getAttribute('height')) * height);
    return this;
  },

  rotateTransform: function (angle) {
    const elPos = this.getPosition();
    const elSize = this.getSize();
    const centerCoordinates = new Coordinates(
      elPos.x + elSize.width / 2,
      elPos.y + elSize.height / 2
    );
    ElementTransformer.rotate(this, centerCoordinates, angle);
    return this;
  }
};

export default Rect;
