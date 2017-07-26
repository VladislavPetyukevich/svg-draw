var UserEvents = function (cellSize, moveStep, controlElements) {
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
}