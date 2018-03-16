var UserEvents = function (cellSize, controlElements) {
	this.selectedElement = undefined;
	this.selectedElementClone = undefined;
	this.lastSelectedElement = undefined;
	this.eventHandlers = [];
	this.dx = 0;
	this.dy = 0;
	this.currentX = 0;
	this.currentY = 0;
	this.controlElements = controlElements;
	this.cellSize = cellSize;

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
		if (this.cellSize != undefined) {
			var translate = ElementTransformer.getTransformAttribute(this.selectedElementClone, 'translate');
			if (translate == undefined) {
				translate = [];
				translate[0] = translate[1] = 0;
			}
			var newX = roundTo(translate[0], this.cellSize / 2);
			var newY = roundTo(translate[1], this.cellSize / 2);
			ElementTransformer.setTransformAttribute(this.selectedElementClone, 'translate', newX + ' ' + newY);
		}
		var translate = ElementTransformer.getTransformAttribute(this.selectedElementClone, 'translate');
		if (translate != undefined) {
			this.selectedElement.translate(translate[0], translate[1]);
		}
		this.selectedElement.style.visibility = 'visible';
		this.selectedElement.parentNode.removeChild(this.selectedElementClone);

		this.addControlElementsEvents(this.selectedElement);

		this.selectedElementClone.removeEventListener("mousemove", this.moveElement);
		this.selectedElementClone.removeEventListener("mouseout", this.deselectElement);
		this.selectedElementClone.removeEventListener("mouseup", this.deselectElement);
		removeEventListener("touchmove", this.moveElement);
		removeEventListener("touchend", this.deselectElement);

		this.lastSelectedElement = this.selectedElement;
		this.selectedElementClone = undefined;
		this.selectedElement = undefined;

		if (this.eventHandlers['onMove']) this.eventHandlers['onMove']();
		if (this.eventHandlers['onSelect']) this.eventHandlers['onSelect']();
		if (this.eventHandlers['onChange']) this.eventHandlers['onChange']();
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

		if (this.cellSize) {
			var size = this.lastSelectedElement.getSize();
			var newWidth = roundTo(size.width, this.cellSize / 2);
			var newHeight = roundTo(size.height, this.cellSize / 2);
			this.lastSelectedElement.setSize(newWidth, newHeight);
			this.controlElements.update(this.lastSelectedElement);
		}

		//update rotate attribute
		var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
		if (rotate != undefined) {
			var newSize = this.lastSelectedElement.getSize();
			var widthDelta = (oldoldSize.width - newSize.width) / 2;
			var heightDelta = (oldoldSize.height - newSize.height) / 2;
			var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
			this.lastSelectedElement.rotate(rotate[0]);
			switch (rotate[0]) {
				case -270:
					if (widthDelta == 0) {
						this.lastSelectedElement.translate(heightDelta, heightDelta);
					} else if (heightDelta == 0) {
						this.lastSelectedElement.translate(widthDelta, -widthDelta);
					} else {
						this.lastSelectedElement.translate(heightDelta, heightDelta);
						this.lastSelectedElement.translate(widthDelta, -widthDelta);
					}
					break;
				case -180:
					if (widthDelta == 0) {
						this.lastSelectedElement.translate(0, heightDelta * 2);
					} else if (heightDelta == 0) {
						this.lastSelectedElement.translate(widthDelta * 2, 0);
					} else {
						this.lastSelectedElement.translate(widthDelta * 2, heightDelta * 2);
					}
					break;
				case -90:
					if (widthDelta == 0) {
						this.lastSelectedElement.translate(-heightDelta, heightDelta);
					} else if (heightDelta == 0) {
						this.lastSelectedElement.translate(widthDelta, widthDelta);
					} else {
						this.lastSelectedElement.translate(-heightDelta, heightDelta);
						this.lastSelectedElement.translate(widthDelta, widthDelta);
					}
					break;
			}
			this.controlElements.update(this.lastSelectedElement);
		}

		removeEventListener("mousemove", this.resize);
		removeEventListener("touchmove", this.resize);
		removeEventListener("mouseup", this.finishResize);
		removeEventListener("touchend", this.finishResize);

		if (this.eventHandlers['onResize']) this.eventHandlers['onResize']();
		if (this.eventHandlers['onChange']) this.eventHandlers['onChange']();
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

		var attribs = getElementNoRotateAttributes(this.lastSelectedElement);
		var centerX = attribs.x + attribs.width / 2;
		var centerY = attribs.y + attribs.height / 2;
		var x = evtCoordinates.clientX - centerX;
		var y = evtCoordinates.clientY - centerY;
		var angle = -(180 + 90 - 180 / Math.PI * Math.atan2(y, x));
		this.lastSelectedElement.rotate(angle);

		this.controlElements.update(this.lastSelectedElement);
	}).bind(this);

	//End of rotate element
	this.finishRotate = (function (evt) {
		var rotate = ElementTransformer.getTransformAttribute(this.lastSelectedElement, 'rotate');
		if (rotate) {
			var angle = rotate[0];
			var newAngle = roundTo(angle, 45);
			ElementTransformer.setTransformAttribute(this.lastSelectedElement, 'rotate', newAngle + ' ' + rotate[1] + ' ' + rotate[2]);
			this.controlElements.update(this.lastSelectedElement);
		}

		removeEventListener("mousemove", this.rotate);
		removeEventListener("touchmove", this.rotate);
		removeEventListener("mouseup", this.finishRotate);
		removeEventListener("touchend", this.finishRotate);

		if (this.eventHandlers['onRotate']) this.eventHandlers['onRotate']();
		if (this.eventHandlers['onChange']) this.eventHandlers['onChange']();
	}).bind(this);

	this.removeElement = (function (evt) {
		var userCanvas = evt.target.parentNode.parentNode.parentNode.getElementById('userCanvas');
		this.controlElements.hide();
		userCanvas.removeChild(this.lastSelectedElement);
		this.lastSelectedElement = undefined;

		if (this.eventHandlers['onChange']) this.eventHandlers['onChange']();
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
	this.eventHandlers['onChange'] = handler;
}

UserEvents.prototype.onSelect = function (handler) {
	this.eventHandlers['onSelect'] = handler;
}

UserEvents.prototype.onMove = function (handler) {
	this.eventHandlers['onMove'] = handler;
}

UserEvents.prototype.onResize = function (handler) {
	this.eventHandlers['onResize'] = handler;
}

UserEvents.prototype.onRotate = function (handler) {
	this.eventHandlers['onRotate'] = handler;
}