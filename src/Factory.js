var Factory = new Object();

Factory.__expand__ = function (child, parrent) {
    for (var key in parrent) {
        Object.defineProperty(child, key, {
            value: parrent[key]
        });
    }
}

Factory.rect = function (object) {
    object.type = 'rect';

    var DOM_Object = DOMFactory.createObject(object);
    Factory.__expand__(DOM_Object, Rect);
    return DOM_Object;
}

Factory.createFromDOM = function (DOM_Rect) {
    var attributes = DOM_Rect.attributes;
    var originalAttributesNames = ['hasControlElements', 'resizable', 'rotatable', 'snapToGrid', 'snapRotateToGrid'];
    var lowCaseAttributes = originalAttributesNames.map(function (el) { return el.toLowerCase(); });
    for (var i = attributes.length; i--;) {
        if (attributes[i].value == 'true') {
            var attribIndex = lowCaseAttributes.indexOf(attributes[i].name);
            if (attribIndex == -1) continue;
            DOM_Rect[originalAttributesNames[attribIndex]] = !!attributes[i].value;
            DOM_Rect.removeAttribute(attributes[i].name);
        }
    }
    Factory.__expand__(DOM_Rect, SVGObject[DOM_Rect.nodeName]);
    return DOM_Rect;
}

Factory.ellipse = function (object) {
    object.type = 'ellipse';
    object.cx = object.x + object.width / 2;
    object.cy = object.y + object.height / 2;
    object.rx = object.width / 2;
    object.ry = object.height / 2;
    object.x = object.y = object.width = object.height = undefined;

    var DOM_Object = DOMFactory.createObject(object);
    Factory.__expand__(DOM_Object, Ellipse);
    return DOM_Object;
}

Factory.path = function (object) {
    object.type = 'path';
    var x = object.x;
    var y = object.y;
    var width = object.width;
    var height = object.height;
    object.x = object.y = object.width = object.height = undefined;

    var DOM_Object = DOMFactory.createObject(object);
    Factory.__expand__(DOM_Object, Path);
    DOM_Object.setPosition(x, y);
    DOM_Object.setSize(width, height);
    return DOM_Object;
}

Factory.text = function (object) { }