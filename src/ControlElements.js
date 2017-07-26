var ControlElements = function (svgContainer, styles) {
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
}