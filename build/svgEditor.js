;(function() {
;var ControlElements = function (svgContainer, styles) {
	this.svgContainer = svgContainer;
	//Set default style values if they are not defined
	styles = isVarExists(styles) ? styles : {};
	styles.size = isVarExists(styles.size) ? styles.size : 15;
	styles.resizeButtonColor = isVarExists(styles.resizeButtonColor) ? styles.resizeButtonColor : 'black';
	styles.closeButtonColor = isVarExists(styles.closeButtonColor) ? styles.closeButtonColor : 'red';
	styles.rotateButtonColor = isVarExists(styles.rotateButtonColor) ? styles.rotateButtonColor : 'orange';
	this.styles = styles;

	this.container = undefined;
	this.resizeButton = Factory.rect({ x: 0, y: 0, width: styles.size, height: styles.size, fill: styles.resizeButtonColor, id: 'resizeButton' });
	this.resizeButton.style['cursor'] = 'se-resize';
	this.closeButton = Factory.ellipse({ x: 0, y: 0, width: styles.size, height: styles.size, fill: styles.closeButtonColor, id: 'closeButton' });
	this.rotateButton = Factory.ellipse({ x: 0, y: 0, width: styles.size, height: styles.size, fill: styles.rotateButtonColor, id: 'rotateButton' });
	this.contour = DOMFactory.createObject({ type: 'polyline', fill: 'none', stroke: 'black', 'stroke-dasharray': '5', 'stroke-width': '1' });
}

ControlElements.prototype.get = function (targetEl) {
	this.container = DOMFactory.createGroup(this.resizeButton, this.closeButton, this.rotateButton, this.contour);
	this.update(targetEl);
	return this.container;
}

ControlElements.prototype.update = function (targetEl) {
	var attrib = getElementNoRotateAttributes(targetEl);
	var elSize = {
		width: attrib.width,
		height: attrib.height
	}
	var elPos = targetEl.getPosition();
	var rotate = ElementTransformer.getTransformAttribute(targetEl, 'rotate');
	if (rotate != null) {
		ElementTransformer.setTransformAttribute(this.container, 'rotate', rotate.join(' '));
	}
	var halfSize = this.styles.size / 2;
	ElementTransformer.setTranslate(this.closeButton, elPos.x + elSize.width - halfSize, elPos.y - halfSize);

	if (targetEl.resizable) {
		ElementTransformer.setTranslate(this.resizeButton, elPos.x + elSize.width - halfSize, elPos.y + elSize.height - halfSize);
	} else {
		ElementTransformer.setTranslate(this.resizeButton, -this.styles.size, -this.styles.size);
	}

	if (targetEl.rotatable) {
		ElementTransformer.setTranslate(this.rotateButton, elPos.x - halfSize + elSize.width / 2, elPos.y - halfSize);
	} else {
		ElementTransformer.setTranslate(this.rotateButton, -this.styles.size, -this.styles.size);
	}

	var point1 = {
		x: elPos.x,
		y: elPos.y
	},
		point2 = {
			x: elPos.x + elSize.width,
			y: elPos.y
		},
		point3 = {
			x: elPos.x + elSize.width,
			y: elPos.y + elSize.height
		},
		point4 = {
			x: elPos.x,
			y: elPos.y + elSize.height
		};
	var points = point1.x + ',' + point1.y + ' ' + point2.x + ',' + point2.y + ' ' + point3.x + ',' + point3.y + ' ' + point4.x + ',' + point4.y + ' ' + point1.x + ',' + point1.y;
	this.contour.setAttribute('points', points);
}

ControlElements.prototype.hide = function () {
	if (this.container == undefined) return;
	this.svgContainer.removeChild(this.container);
	this.container = undefined;
};var DOMFactory = new Object();

DOMFactory.createGroup = function() {
	var newEl = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	for(var i = arguments.length; i--;){
		if(arguments[i]  == undefined) continue;
		newEl.appendChild(arguments[i]);
	}
	return newEl;
}

DOMFactory.createObject = function(props){
	if(typeof props.type == 'undefined') return;
	var newEl = document.createElementNS("http://www.w3.org/2000/svg", props.type);
	delete props.type;
	for(var key in props){
		if(props[key] == undefined) continue;
		if(key == 'innerHTML'){
			newEl.innerHTML = props[key];
			continue;
		}
		newEl.setAttribute(key, props[key]);
	}
	return newEl;
};var ElementTransformer = new Object();

ElementTransformer.getStandartAttributes = function () {
    //transform attributes applying order
    return {
        matrix: undefined,
        translate: undefined,
        scale: undefined,
        rotate: undefined,
        skewX: undefined,
        skewY: undefined
    }
}

ElementTransformer.getTransformAttribute = function (element, attribute) {
    var transform = element.getAttribute('transform');
    if(transform == undefined) return;
    transform = transform.trim();
    var regexp = new RegExp('(' + attribute + ')\\(([\\d- \\\-\\\,\\\.]+)\\)', 'i');
    '([\w]+)(\([\d \-\,\.]+\))';
    var result = transform.match(regexp);
    if (result != undefined) {
        var matrix = result[2].split(' ');
        for (var i = matrix.length; i--;) {
            matrix[i] = parseFloat(matrix[i]);
        }
        return (matrix.length == 1) ? matrix[0] : matrix;
    }
    return undefined;
}

ElementTransformer.setTransformAttribute = function (element, attribute, value) {
    var transform = element.getAttribute('transform');
    var regexp = /([\w]+)(\([\d \-\,\.]+\))/g;
    var match;
    var attributes = ElementTransformer.getStandartAttributes();
    while ((match = regexp.exec(transform)) !== null) {
        if (match[1] == attribute) continue;
        attributes[match[1]] = match[2];
    }
    attributes[attribute] = '(' + value + ')';

    var newTransform = '';
    for (var attrib in attributes) {
        if (attributes[attrib] == undefined) continue;
        newTransform += attrib + attributes[attrib] + ' ';
    }
    newTransform = newTransform.trim();
    element.setAttribute('transform', newTransform);
}

ElementTransformer.parseTransform = function (transform) {
    var regexp = /([\w]+)\(([\d \-\,\.]+)\)/g;
    var match;
    var elementAttributes = [];
    while ((match = regexp.exec(transform)) !== null) {
        elementAttributes.push({ attribute: match[1], value: match[2] });
    }
    return elementAttributes;
}

ElementTransformer.getTransformAttributes = function (element) {
    var transform = element.getAttribute('transform');
    return ElementTransformer.parseTransform(transform);
}

ElementTransformer.removeTransformAttribute = function (element, attribute) {
    var elementAttributes = this.getTransformAttributes(element);
    var newTransform = '';
    for (var i = elementAttributes.length; i--;) {
        if (elementAttributes[i].attribute == attribute) continue;
        newTransform += elementAttributes[i].attribute + '(' + elementAttributes[i].value + ') ';
    }
    newTransform.trim();
    element.setAttribute('transform', newTransform);
}

ElementTransformer.addTranslate = function (element, coordinates) {
    var x = coordinates.x;
    var y = coordinates.y;

    var oldTranslate = ElementTransformer.getTransformAttribute(element, 'translate');
    var newTranslate;
    if (oldTranslate != undefined) {
        oldTranslate[0] += x;
        oldTranslate[1] += y;
        newTranslate = oldTranslate.join(' ');
    } else {
        newTranslate = x + ' ' + y;
    }
    ElementTransformer.setTransformAttribute(element, 'translate', newTranslate);
}

ElementTransformer.setTranslate = function (element, x, y) {
    ElementTransformer.setTransformAttribute(element, 'translate', x + ' ' + y);
}

ElementTransformer.getTranslate = function (element) {
    var translate = ElementTransformer.getTransformAttribute(element, 'translate');
    return {
        x: translate[0],
        y: translate[1]
    }
}

ElementTransformer.addScale = function (element, coordinates) {
    var oldScale = ElementTransformer.getTransformAttribute(element, 'scale');
    var newScale;
    if (oldScale == undefined) {
        oldScale = [];
        oldScale[0] = 1;
        oldScale[1] = 1;
    }
    oldScale[0] += coordinates.x;
    oldScale[1] += coordinates.y;
    newScale = oldScale.join(' ');
    ElementTransformer.setTransformAttribute(element, 'scale', newScale);
}

ElementTransformer.setScale = function (element, width, height) {
    ElementTransformer.setTransformAttribute(element, 'scale', width + ' ' + height);
}

ElementTransformer.getScale = function (element) {
    var scale = ElementTransformer.getTransformAttribute(element, 'scale');
    return {
        width: scale[0],
        height: scale[1]
    }
}

ElementTransformer.rotate = function (element, x, y, angle) {
    ElementTransformer.setTransformAttribute(element, 'rotate', angle + ' ' + x + ' ' + y);
};var Factory = new Object();

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

Factory.text = function (object) { };var Ellipse = new Object();

Ellipse.translate = function (x, y) {
    this.setAttribute('cx', Number(this.getAttribute('cx')) + x);
    this.setAttribute('cy', Number(this.getAttribute('cy')) + y);
    var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
    if (rotate != undefined) {
        ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
    }
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
}

Ellipse.setSize = function (width, height) {
    var oldSize = this.getSize();
    this.scale(width / oldSize.width, height / oldSize.height);
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
}

Ellipse.rotate = function (angle) {
    var elPos = this.getPosition();
    var elSize = this.getSize();
    var centerX = elPos.x + elSize.width / 2;
    var centerY = elPos.y + elSize.height / 2;
    ElementTransformer.setTransformAttribute(this, 'rotate', angle + ' ' + centerX + ' ' + centerY);
};var Path = new Object();

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
    var centerX = elPos.x + elSize.width / 2;
    var centerY = elPos.y + elSize.height / 2;
    ElementTransformer.setTransformAttribute(this, 'rotate', angle + ' ' + centerX + ' ' + centerY);
};var Rect = new Object();

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
    var centerX = elPos.x + elSize.width / 2;
    var centerY = elPos.y + elSize.height / 2
    ElementTransformer.setTransformAttribute(this, 'rotate', angle + ' ' + centerX + ' ' + centerY);
};var SVGObject = {
    rect: Rect,
    ellipse: Ellipse,
    path: Path
};;var SvgEditor = function (props) {
	this.svgEl = props.svg;
	this.cellSize = props.cellSize;
	this.moveStep = props.step;

	this.__addSvgStyles();
	//init layers
	this.layers = [];
	this.layers['userCanvas'] = undefined;
	this.initUserCanvasLayer();
	this.layers['grid'] = undefined;
	if (this.cellSize != undefined) {
		this.initGridLayer();
	}
	this.layers['controlElements'] = undefined;
	this.initControlElementsLayer();

	this.controlElements = new ControlElements(this.layers['controlElements'], props.controlElementsStyles);
	this.userEvents = new UserEvents(this.cellSize, this.moveStep, this.controlElements);
	this.makeDraggable = this.userEvents.makeDraggable.bind(this.userEvents);
	this.factory = Factory;
	var click = function (evt) {
		if ((evt.target != this.svgEl) || (this.userEvents.controlElements == undefined)) return;
		this.userEvents.controlElements.hide();
	}
	this.svgEl.addEventListener('click', click.bind(this));
	this.svgEl.addEventListener('touchend', click.bind(this));
}

SvgEditor.prototype.__addSvgStyles = function () {
	this.svgEl.style['user-select'] = 'none';
	this.svgEl.style['-webkit-user-select'] = 'none';
	this.svgEl.style['-khtml-user-select'] = 'none';
	this.svgEl.style['-moz-user-select'] = 'none';
	this.svgEl.style['-o-user-select'] = 'none';
}

SvgEditor.prototype.initUserCanvasLayer = function () {
	this.layers['userCanvas'] = this.svgEl.appendChild(DOMFactory.createGroup());
	this.layers['userCanvas'].setAttribute('id', 'userCanvas');
}

SvgEditor.prototype.initGridLayer = function () {
	this.layers['grid'] = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	this.layers['grid'].setAttribute("id", "grid");
	this.layers['grid'].style['pointer-events'] = 'none';
	var svgWidth = parseInt(this.svgEl.getAttribute('width'));
	var svgHeight = parseInt(this.svgEl.getAttribute('height'));

	for (var i = 0; i < svgWidth; i += this.cellSize) {
		var line = DOMFactory.createObject({ type: 'line', x1: i, y1: 0, x2: i, y2: svgHeight, 'stroke-width': 1, stroke: '#333333' });
		this.layers['grid'].appendChild(line);
	};

	for (var i = 0; i < svgHeight; i += this.cellSize) {
		var line = DOMFactory.createObject({ type: 'line', x1: 0, y1: i, x2: svgWidth, y2: i, 'stroke-width': 1, stroke: '#333333' });
		this.layers['grid'].appendChild(line);
	};

	this.svgEl.appendChild(this.layers['grid']);
}

SvgEditor.prototype.initControlElementsLayer = function () {
	this.layers['controlElements'] = DOMFactory.createGroup();
	this.layers['controlElements'].setAttribute('id', 'controlElementsLayer');
	this.svgEl.appendChild(this.layers['controlElements']);
}

SvgEditor.prototype.saveToSvg = function () {
	var newSvgEl = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	newSvgEl.setAttribute('viewBox', '0 0 ' + this.svgEl.getAttribute('width') + ' ' + this.svgEl.getAttribute('height'));
	newSvgEl.innerHTML += this.layers['userCanvas'].innerHTML;
	var originalChildList = this.layers['userCanvas'].childNodes;
	var childList = newSvgEl.childNodes;
	for (var i = childList.length; i--;) {
		var keys = Object.keys(originalChildList[i]);
		for (var k = keys.length; k--;) {
			childList[i].setAttribute(keys[k], originalChildList[i][keys[k]])
		}
	}
	return prepareSvgCodeToSave(newSvgEl, this.svgEl.getAttribute('width'), this.svgEl.getAttribute('height'));
}

SvgEditor.prototype.loadFromSvg = function (svgData) {
	var tmpDiv = document.createElement('div');
	tmpDiv.innerHTML = svgData;
	var svgEl = tmpDiv.firstChild;
	var svgChild = svgEl.childNodes;
	for (var i = svgChild.length; i--;) {
		if (svgChild[i].nodeType === Node.COMMENT_NODE) continue;
		if (Object.keys(SVGObject).indexOf(svgChild[i].nodeName) == -1) continue;
		var el = this.factory.createFromDOM(svgChild[i]);
		if (el.getAttribute('class') == 'draggableSvg') {
			this.userEvents.makeDraggable(el);
		}
		this.layers['userCanvas'].insertBefore(el, this.layers['userCanvas'].firstChild)
	}
}

SvgEditor.prototype.getSvgImageLink = function () {
	var userCanvas = prepareSvgCodeToSave(this.layers['userCanvas'], this.svgEl.getAttribute('width'), this.svgEl.getAttribute('height'));
	var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(userCanvas);
	return url;
}

SvgEditor.prototype.getImageLink = function () {
	return new Promise(function (resolve, reject) {
		var html = prepareSvgCodeToSave(this.layers['userCanvas'], this.svgEl.getAttribute('width'), this.svgEl.getAttribute('height'));
		var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
		var canvas = document.createElement("canvas");
		canvas.setAttribute('width', parseInt(this.svgEl.getAttribute('width')));
		canvas.setAttribute('height', parseInt(this.svgEl.getAttribute('height')));
		var context = canvas.getContext("2d");

		var image = new Image;
		image.src = imgsrc;
		image.onload = function () {
			context.drawImage(image, 0, 0);
			var canvasdata = canvas.toDataURL("image/png");
			resolve(canvasdata);
		};
	}.bind(this));
}

SvgEditor.prototype.add = function (object) {
	this.layers['userCanvas'].appendChild(object);
	if (this.userEvents.onChangeHandler != undefined) this.userEvents.onChangeHandler();
}

SvgEditor.prototype.getSelectedElement = function () {
	return this.userEvents.lastSelectedElement;
};var UserEvents = function (cellSize, moveStep, controlElements) {
	this.selectedElement = undefined;
	this.selectedElementClone = undefined;
	this.lastSelectedElement = undefined;
	this.onChangeHandler = undefined;
	this.onSelectHandler = undefined;
	this.onResizeHandler = undefined;
	this.onMoveHandler = undefined;
	this.onRotateHandler = undefined;
	this.dx = 0;
	this.dy = 0;
	this.currentX = 0;
	this.currentY = 0;
	this.controlElements = controlElements;
	this.cellSize = cellSize;
	this.baseElementSize = (this.cellSize != undefined) ? this.cellSize : 20;
	this.moveStep = moveStep;
	if (this.cellSize != undefined)
		this.roundMoveStepNum = (this.moveStep != undefined) ? this.cellSize * this.moveStep : this.cellSize;

	//Select element event
	this.selectElement = (function (evt) {
		if (evt.button == 2) return;
		this.selectedElement = evt.target;
		this.selectedElementClone = this.selectedElement.cloneNode();
		this.selectedElementClone.innerHTML = this.selectedElement.innerHTML;
		this.selectedElement.parentNode.appendChild(this.selectedElementClone);
		this.selectedElement.style.visibility = 'hidden';
		if (this.controlElements != undefined) {
			this.controlElements.hide();
		}
		var evtCoordinates = getEventCoordinates(evt);
		this.currentX = evtCoordinates.clientX;
		this.currentY = evtCoordinates.clientY;
		this.dx = 0;
		this.dy = 0;

		this.selectedElementClone.addEventListener("mousemove", this.moveElement);
		this.selectedElementClone.addEventListener("mouseout", this.deselectElement);
		this.selectedElementClone.addEventListener("mouseup", this.deselectElement);
		addEventListener("touchmove", this.moveElement);
		addEventListener("touchend", this.deselectElement);
	}).bind(this);

	//Move element event
	this.moveElement = (function (evt) {
		var evtCoordinates = getEventCoordinates(evt);
		this.dx += evtCoordinates.clientX - this.currentX;
		this.dy += evtCoordinates.clientY - this.currentY;

		ElementTransformer.addTranslate(this.selectedElementClone, { x: this.dx, y: this.dy });

		this.dx = 0;
		this.dy = 0;

		this.currentX = evtCoordinates.clientX;
		this.currentY = evtCoordinates.clientY;
	}).bind(this);

	//Finish move element event
	this.deselectElement = (function (evt) {
		if (this.selectedElementClone == undefined) return;
		if ((this.cellSize != undefined) && (this.selectedElement.snapToGrid == true)) {
			var translate = ElementTransformer.getTransformAttribute(this.selectedElementClone, 'translate');
			if (translate == undefined) {
				translate = [];
				translate[0] = translate[1] = 0;
			}
			var newX = roundTo(translate[0], this.roundMoveStepNum);
			var newY = roundTo(translate[1], this.roundMoveStepNum);
			ElementTransformer.setTransformAttribute(this.selectedElementClone, 'translate', newX + ' ' + newY);
		}
		var translate = ElementTransformer.getTransformAttribute(this.selectedElementClone, 'translate');
		if (translate != undefined) {
			this.selectedElement.translate(translate[0], translate[1]);
		}
		this.selectedElement.style.visibility = 'visible';
		this.selectedElement.parentNode.removeChild(this.selectedElementClone);

		if (this.selectedElement.hasControlElements == true) {
			this.addControlElementsEvents(this.selectedElement);
		}

		this.selectedElementClone.removeEventListener("mousemove", this.moveElement);
		this.selectedElementClone.removeEventListener("mouseout", this.deselectElement);
		this.selectedElementClone.removeEventListener("mouseup", this.deselectElement);
		removeEventListener("touchmove", this.moveElement);
		removeEventListener("touchend", this.deselectElement);

		this.lastSelectedElement = this.selectedElement;
		this.selectedElementClone = undefined;
		this.selectedElement = undefined;

		if (this.onMoveHandler != undefined) this.onMoveHandler();
		if (this.onSelectHandler != undefined) this.onSelectHandler();
		if (this.onChangeHandler != undefined) this.onChangeHandler();
	}).bind(this);

	//Mouse down on resize button
	this.startResize = (function (evt) {
		var evtCoordinates = getEventCoordinates(evt);
		this.currentX = evtCoordinates.clientX;
		this.currentY = evtCoordinates.clientY;

		addEventListener("mousemove", this.resize);
		addEventListener("touchmove", this.resize);
	}).bind(this);

	//Resizing element
	this.resize = (function (evt) {
		if (evt.button == 2) return;
		var evtCoordinates = getEventCoordinates(evt);
		this.dx = evtCoordinates.clientX - this.currentX;
		this.dy = evtCoordinates.clientY - this.currentY;
		var scaleVector = {
			x: this.dx / this.lastSelectedElement.getBBox().width,
			y: this.dy / this.lastSelectedElement.getBBox().height
		}
		var elPos = this.lastSelectedElement.getPosition();

		var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
		if (rotate != undefined) {
			ElementTransformer.removeTransformAttribute(this.lastSelectedElement, 'rotate');
			scaleVector = rotateVector(scaleVector, -rotate[0]);
		}
		ElementTransformer.addScale(this.lastSelectedElement, scaleVector);
		ElementTransformer.setTransformAttribute(this.lastSelectedElement, 'translate', elPos.x + ' ' + elPos.y);
		var newTransform = this.lastSelectedElement.getAttribute('transform');
		newTransform += ' translate(' + (-elPos.x) + ' ' + (-elPos.y) + ')';
		if (rotate != undefined) {
			newTransform = 'rotate(' + rotate[0] + ' ' + rotate[1] + ' ' + rotate[2] + ') ' + newTransform;
		}
		this.lastSelectedElement.setAttribute('transform', newTransform);
		this.currentX = evtCoordinates.clientX;
		this.currentY = evtCoordinates.clientY;
		this.controlElements.update(this.lastSelectedElement);

		addEventListener("mouseup", this.finishResize);
		addEventListener("touchend", this.finishResize);
	}).bind(this);

	//End of resizing element
	this.finishResize = (function (evt) {
		var oldoldSize = this.lastSelectedElement.getSize();
		var scale = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'scale');
		var size = this.lastSelectedElement.getSize();
		this.lastSelectedElement.scale(scale[0], scale[1]);
		var size = this.lastSelectedElement.getSize();
		ElementTransformer.removeTransformAttribute(this.lastSelectedElement, 'scale');
		ElementTransformer.removeTransformAttribute(this.lastSelectedElement, 'translate');

		if ((this.cellSize != undefined) && (this.lastSelectedElement.snapToGrid == true)) {
			var size = this.lastSelectedElement.getSize();
			var newWidth = roundTo(size.width, this.roundMoveStepNum);
			var newHeight = roundTo(size.height, this.roundMoveStepNum);
			this.lastSelectedElement.setSize(newWidth, newHeight);
			this.controlElements.update(this.lastSelectedElement);
		}

		//update rotate attribute
		var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
		if (rotate != undefined) {
			var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
			var attrib = getElementAttributes(this.lastSelectedElement);
			this.lastSelectedElement.rotate(rotate[0]);
			//update turned element position after change rotate center coordinates
			// var newAttrib = getElementAttributes(this.lastSelectedElement);
			// var dx = newAttrib.x - attrib.x;
			// var dy = newAttrib.y - attrib.y;
			// this.lastSelectedElement.translate(-dx, -dy);
			// if (this.cellSize != undefined) {
			// 	var pos = this.lastSelectedElement.getPosition();
			// 	var newX = roundTo(pos.x, this.roundMoveStepNum);
			// 	var newY = roundTo(pos.y, this.roundMoveStepNum);
			// 	this.lastSelectedElement.setPosition(newX, newY);
			// }

			this.controlElements.update(this.lastSelectedElement);
		}

		removeEventListener("mousemove", this.resize);
		removeEventListener("touchmove", this.resize);
		removeEventListener("mouseup", this.finishResize);
		removeEventListener("touchend", this.finishResize);

		if (this.onResizeHandler != undefined) this.onResizeHandler();
		if (this.onChangeHandler != undefined) this.onChangeHandler();
	}).bind(this);

	//Mouse down on rotate button
	this.startRotate = (function (evt) {
		var evtCoordinates = getEventCoordinates(evt);
		this.currentX = evtCoordinates.clientX;
		this.currentY = evtCoordinates.clientY;

		addEventListener("mousemove", this.rotate);
		addEventListener("touchmove", this.rotate);
		addEventListener("mouseup", this.finishRotate);
		addEventListener("touchend", this.finishRotate);
	}).bind(this);

	//Rotate element
	this.rotate = (function (evt) {
		if (evt.button == 2) return;
		var evtCoordinates = getEventCoordinates(evt);
		this.dx = evtCoordinates.clientX - this.currentX;
		this.dy = evtCoordinates.clientY - this.currentY;

		var elPos = this.lastSelectedElement.getPosition();
		var elSize = this.lastSelectedElement.getSize();
		var centerX = elPos.x + elSize.width / 2;
		var centerY = elPos.y + elSize.height / 2;
		var x = evtCoordinates.clientX - centerX;
		var y = evtCoordinates.clientY - centerY;
		var angle = -(180 + 90 - 180 / Math.PI * Math.atan2(y, x));
		this.lastSelectedElement.rotate(angle);

		this.controlElements.update(this.lastSelectedElement);
	}).bind(this);

	//End of rotate element
	this.finishRotate = (function (evt) {
		var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
		if ((this.lastSelectedElement.snapRotateToGrid) && (rotate != undefined)) {
			var angle = rotate[0];
			var newAngle = roundTo(angle, 45);
			ElementTransformer.setTransformAttribute(this.lastSelectedElement, 'rotate', newAngle + ' ' + rotate[1] + ' ' + rotate[2]);
			this.controlElements.update(this.lastSelectedElement);
		}

		removeEventListener("mousemove", this.rotate);
		removeEventListener("touchmove", this.rotate);
		removeEventListener("mouseup", this.finishRotate);
		removeEventListener("touchend", this.finishRotate);

		if (this.onRotateHandler != undefined) this.onRotateHandler();
		if (this.onChangeHandler != undefined) this.onChangeHandler();
	}).bind(this);

	this.removeElement = (function (evt) {
		var userCanvas = evt.target.parentNode.parentNode.parentNode.getElementById('userCanvas');
		this.controlElements.hide();
		userCanvas.removeChild(this.lastSelectedElement);
		this.lastSelectedElement = undefined;

		if (this.onChangeHandler != undefined) this.onChangeHandler();
	}).bind(this);
}

UserEvents.prototype.makeDraggable = function (el) {
	el.setAttribute("class", "draggableSvg");
	el.setAttribute("style", "position:relative;");
	if (el.getAttribute('transform') == null) {
		el.setAttribute("transform", "");
	}
	el.addEventListener("mousedown", this.selectElement);
	el.addEventListener("touchstart", this.selectElement);
}

UserEvents.prototype.addControlElementsEvents = function (el) {
	var controlElements = this.controlElements.get(el);
	var controlElementsLayer = el.parentNode.parentNode.getElementById('controlElementsLayer');

	this.controlElements.closeButton.addEventListener('mouseup', this.removeElement);
	this.controlElements.closeButton.addEventListener('touchend', this.removeElement);
	this.controlElements.resizeButton.addEventListener('mousedown', this.startResize);
	this.controlElements.resizeButton.addEventListener('touchstart', this.startResize);
	this.controlElements.rotateButton.addEventListener('mousedown', this.startRotate);
	this.controlElements.rotateButton.addEventListener('touchstart', this.startRotate);

	controlElementsLayer.appendChild(controlElements);
}

UserEvents.prototype.onChange = function (handler) {
	this.onChangeHandler = handler;
}

UserEvents.prototype.onSelect = function (handler) {
	this.onSelectHandler = handler;
}

UserEvents.prototype.onMove = function (handler) {
	this.onMoveHandler = handler;
}

UserEvents.prototype.onResize = function (handler) {
	this.onResizeHandler = handler;
}

UserEvents.prototype.onRotate = function (handler) {
	this.onRotateHandler = handler;
};var roundTo = function (number, round) {
	return Math.round(number / round) * round;
}

function rotateVector(vector, angle) {
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

function getElementNoRotateAttributes(el) {
	var elCopy = el.cloneNode();
	ElementTransformer.removeTransformAttribute(elCopy, 'rotate');
	elCopy.style.visibility = 'hidden';
	elCopy.innerHTML = el.innerHTML;
	el.parentNode.appendChild(elCopy);
	var attributes = getElementAttributes(elCopy);
	el.parentNode.removeChild(elCopy);
	return attributes;
}

function getSafeAttributeName(name) {
	var result = '' + name;
	if (result.indexOf('-') == -1) return result;

	var arr = result.split('-');
	for (var i = 1; i < arr.length; i++) {
		arr[i] = arr[i].toUpperCase()[0] + arr[i].slice(1);
	}
	return arr.join('')
}

function getEventCoordinates(event) {
	if (isVarExists(event.touches)) {
		return event.touches[0];
	}
	return event;
}

function prepareSvgCodeToSave(svgEl, width, height) {
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

function isVarExists(variable) {
	return typeof variable !== 'undefined';
};
if (typeof module !== 'undefined') {
    module.exports = SvgEditor;
}

if (typeof window !== "undefined") {
	window.SvgEditor = SvgEditor;
}
}());