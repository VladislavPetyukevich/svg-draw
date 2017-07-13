var roundTo = function (number, round) {
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

var getElementAttributes = function (el) {
	var bodyBoundingClientRect = document.body.getBoundingClientRect();
	var boundingClientRect = el.getBoundingClientRect();
	var attributes = {};
	attributes.y = boundingClientRect.top - bodyBoundingClientRect.top;
	attributes.x = boundingClientRect.left - bodyBoundingClientRect.left;
	attributes.width = boundingClientRect.width;
	attributes.height = boundingClientRect.height;
	return attributes;
}

var getElementNoRotateAttributes = function (el) {
	var elCopy = el.cloneNode();
	ElementTransformer.removeTransformAttribute(elCopy, 'rotate');
	elCopy.style.visibility = 'hidden';
	elCopy.innerHTML = el.innerHTML;
	el.parentNode.appendChild(elCopy);
	var attributes = getElementAttributes(elCopy);
	el.parentNode.removeChild(elCopy);
	return attributes;
}

var getSafeAttributeName = function (name) {
	var result = '' + name;
	if (result.indexOf('-') == -1) return result;

	var arr = result.split('-');
	for (var i = 1; i < arr.length; i++) {
		arr[i] = arr[i].toUpperCase()[0] + arr[i].slice(1);
	}
	return arr.join('')
}

var getEventCoordinates = function (event) {
	if(isVarExists(event.touches)){
		return event.touches[0];
	}
	return event;
}

prepareSvgCodeToSave = function (svgEl, width, height) {
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

var isVarExists = function (variable) {
	return typeof variable !== 'undefined';
}