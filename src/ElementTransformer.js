var ElementTransformer = new Object();

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
  if (transform == undefined) return;
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
}

export default ElementTransformer;
