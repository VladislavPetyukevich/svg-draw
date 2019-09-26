import DOMFactory from './DOMFactory';
import Rect from './Objects/Rect';
import Ellipse from './Objects/Ellipse';
import Path from './Objects/Path';
import Text, {
  WIDTH_ATTRIB_NAME as TEXT_WIDTH_ATTRIB_NAME,
  HEIGHT_ATTRIB_NAME as TEXT_HEIGHT_ATTRIB_NAME
} from './Objects/Text';

var Factory = {
  rect: function (object) {
    var DOM_Object = DOMFactory.createObject('rect', object);
    return Object.assign(DOM_Object, Rect);
  },

  ellipse: function (object) {
    object.cx = object.x + object.width / 2;
    object.cy = object.y + object.height / 2;
    object.rx = object.width / 2;
    object.ry = object.height / 2;
    object.x = object.y = object.width = object.height = undefined;

    var DOM_Object = DOMFactory.createObject('ellipse', object);
    return Object.assign(DOM_Object, Ellipse);
  },

  path: function (object) {
    var x = object.x;
    var y = object.y;
    var width = object.width;
    var height = object.height;
    object.x = object.y = object.width = object.height = undefined;

    var DOM_Object = DOMFactory.createObject('path', object);
    Object.assign(DOM_Object, Path);
    DOM_Object.setPosition(x, y);
    DOM_Object.setSize(width, height);
    return DOM_Object;
  },

  text: function (object) {
    object[TEXT_WIDTH_ATTRIB_NAME] = object.width;
    delete object.width;
    object.lengthAdjust = 'spacingAndGlyphs';
    object['font-family'] = 'monospace';
    object[TEXT_HEIGHT_ATTRIB_NAME] = object.height;
    delete object.height;
    object['dominant-baseline'] = 'text-before-edge';

    const DOM_Object = DOMFactory.createObject('text', object);
    const TextObject = Object.assign(DOM_Object, Text);
    return TextObject;
  },
};

export default Factory;
