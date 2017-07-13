var SvgEditor = function (props) {
	this.svgEl = props.svg;
	this.cellSize = props.cellSize;
	this.moveStep = props.step;

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

SvgEditor.prototype.initUserCanvasLayer = function () {
	this.layers['userCanvas'] = this.svgEl.appendChild(DOMFactory.createGroup());
	this.layers['userCanvas'].setAttribute('id', 'userCanvas');
}

SvgEditor.prototype.initGridLayer = function () {
	this.layers['grid'] = document.createElementNS("http://www.w3.org/2000/svg", 'g');
	this.layers['grid'].setAttribute("id", "grid");
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
	if(this.userEvents.onChangeHandler != undefined) this.userEvents.onChangeHandler();
}

SvgEditor.prototype.getSelectedElement = function () {
	return this.userEvents.lastSelectedElement;
}