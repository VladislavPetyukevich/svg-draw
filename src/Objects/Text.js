import { getElementNoRotateAttributes } from '../util';
import ElementTransformer from '../ElementTransformer';

export const X_ATTRIB_NAME = 'x';
export const Y_ATTRIB_NAME = 'y';
export const WIDTH_ATTRIB_NAME = 'textLength';
export const HEIGHT_ATTRIB_NAME = 'font-size';

var Text = {
  translate: function (x, y) {
    this.setAttribute(X_ATTRIB_NAME, Number(this.getAttribute(X_ATTRIB_NAME)) + x);
    this.setAttribute(Y_ATTRIB_NAME, Number(this.getAttribute(Y_ATTRIB_NAME)) + y);
    const rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
    if (rotate != undefined) {
      ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
    }
    return this;
  },

  getPosition: function () {
    return {
      x: Number(this.getAttribute(X_ATTRIB_NAME)),
      y: Number(this.getAttribute(Y_ATTRIB_NAME))
    };
  },

  getSize: function () {
    return {
      width: +this.getAttribute(WIDTH_ATTRIB_NAME),
      height: +this.getAttribute(HEIGHT_ATTRIB_NAME)
    };
  },

  scale: function (width, height) {
    this.setAttribute(WIDTH_ATTRIB_NAME, +this.getAttribute(WIDTH_ATTRIB_NAME) * width);
    this.setAttribute(HEIGHT_ATTRIB_NAME, +this.getAttribute(HEIGHT_ATTRIB_NAME) * height);
    return this;
  },

  setSize: function (width, height) {
    this.setAttribute(WIDTH_ATTRIB_NAME, width);
    this.setAttribute(HEIGHT_ATTRIB_NAME, height);
    return this;
  },

  setPosition: function (x, y) {
    this.setAttribute(X_ATTRIB_NAME, x);
    this.setAttribute(Y_ATTRIB_NAME, y);
    return this;
  },

  rotateTransform: function (angle) {
    const bRect = getElementNoRotateAttributes(this);
    const centerCoordinates = {
      x: bRect.x + bRect.width / 2,
      y: bRect.y + bRect.height / 2
    };
    ElementTransformer.rotate(this, centerCoordinates, angle);
    return this;
  }
};

export default Text;
