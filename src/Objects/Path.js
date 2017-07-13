var Path = new Object();

Path.translate = function (x, y) {
    var path = this.getAttribute('d').split(' ');
    var resultPath = '';
    for (var i = 0; i < path.length; i++) {
        var numberIndex = path[i].search(/[-0-9]+/);
        if (numberIndex == -1) {
            resultPath += path[i];
            continue;
        }
        var buffer = path[i].slice(0, numberIndex);
        var numbers = path[i].slice(numberIndex).split(',');

        numbers = numbers.map(function (num, i) {
            return Number(num) + ((i == 0) ? x : y);
        });
        resultPath += buffer + numbers.join(',') + ' ';
    }
    this.setAttribute('d', resultPath.trim());

    var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
    if (rotate != undefined) {
        ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
    }
}

Path.getPosition = function () {
    var path = this.getAttribute('d').split(' ');
    var x = undefined;
    var y = undefined;
    for (var i = 0; i < path.length; i++) {
        var numberIndex = path[i].search(/[-0-9]+/);
        if (numberIndex == -1) {
            continue;
        }
        var buffer = path[i].slice(0, numberIndex);
        var numbers = path[i].slice(numberIndex).split(',');
        numbers = numbers.map(function (num, i) {
            return Number(num);
        });
        if ((numbers[0] < x) || (x == undefined)) {
            x = numbers[0];
        }
        if ((numbers[1] < y) || (y == undefined)) {
            y = numbers[1];
        }
    }

    return {
        x: x,
        y: y
    }
}

Path.getSize = function () {
    var path = this.getAttribute('d').split(' ');
    var x = undefined;
    var y = undefined;
    var xMax = undefined;
    var yMax = undefined;
    for (var i = 0; i < path.length; i++) {
        var numberIndex = path[i].search(/[-0-9]+/);
        if (numberIndex == -1) {
            continue;
        }
        var buffer = path[i].slice(0, numberIndex);
        var numbers = path[i].slice(numberIndex).split(',');
        numbers = numbers.map(function (num, i) {
            return Number(num);
        });
        if ((numbers[0] < x) || (x == undefined)) {
            x = numbers[0];
        }
        if ((numbers[1] < y) || (y == undefined)) {
            y = numbers[1];
        }
        if ((numbers[0] > xMax) || (xMax == undefined)) {
            xMax = numbers[0];
        }
        if ((numbers[1] > yMax) || (yMax == undefined)) {
            yMax = numbers[1];
        }
    }

    return {
        width: xMax - x,
        height: yMax - y
    }
}

Path.setPosition = function (x, y) {
    var oldPos = this.getPosition();
    var dx = x - oldPos.x;
    var dy = y - oldPos.y;
    this.translate(dx, dy);
}

Path.setSize = function (width, height) {
    var oldSize = this.getSize();
    this.scale(width / oldSize.width, height / oldSize.height);
}

Path.scale = function (width, height) {
    var size = this.getSize();
    var posBefore = this.getPosition();
    var scale = [width, height];
    var path = this.getAttribute('d').split(' ');
    var resultPath = '';
    for (var i = 0; i < path.length; i++) {
        var numberIndex = path[i].search(/[-0-9]+/);
        if (numberIndex == -1) {
            resultPath += path[i];
            continue;
        }
        var buffer = path[i].slice(0, numberIndex);
        var numbers = path[i].slice(numberIndex).split(',');
        numbers = numbers.map(function (num, i) {
            return Number(num) * scale[i];
        });
        resultPath += buffer + numbers.join(',') + ' ';
    }
    this.setAttribute('d', resultPath.trim());
    var posAfter = this.getPosition();
    var diffX = posAfter.x - posBefore.x;
    var diffY = posAfter.y - posBefore.y;
    this.translate(-diffX, -diffY);
    var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
    if (rotate != undefined) {
        this.rotate(rotate[0]);
    }
}

Path.rotate = function (angle) {
    var elPos = this.getPosition();
    var elSize = this.getSize();
    centerX = elPos.x + elSize.width / 2;
    centerY = elPos.y + elSize.height / 2;
    ElementTransformer.setTransformAttribute(this, 'rotate', angle + ' ' + centerX + ' ' + centerY);
}