var Rect = new Object();

Rect.translate = function (x, y) {
    this.setAttribute('x', Number(this.getAttribute('x')) + x);
    this.setAttribute('y', Number(this.getAttribute('y')) + y);
    var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
    if (rotate != undefined) {
        ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
    }
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
}

Rect.setSize = function (width, height) {
    this.setAttribute('width', width);
    this.setAttribute('height', height);
}

Rect.scale = function (width, height) {
    this.setAttribute('width', Number(this.getAttribute('width')) * width);
    this.setAttribute('height', Number(this.getAttribute('height')) * height);
}

Rect.rotate = function (angle) {
    var elPos = this.getPosition();
    var elSize = this.getSize();
    centerX = elPos.x + elSize.width / 2;
    centerY = elPos.y + elSize.height / 2
    ElementTransformer.setTransformAttribute(this, 'rotate', angle + ' ' + centerX + ' ' + centerY);
}