import ElementTransformer from '../ElementTransformer';
import Coordinates from '../DataStructures/Coordinates';

var Path = new Object();

Path.toArray = function () {
  var resultPathArray = [];
  var path = this.getAttribute('d').split(' ');
  for (var i = 0; i < path.length; i++) {
    if (path[i].length == 1) { //if it single command like 'Z' without coords
      resultPathArray.push([path[i]]);
      continue;
    }
    var command = path[i].slice(0, 1);
    var numbers = path[i].slice(1).split(',').map(function (number) {
      return Number(number);
    });
    resultPathArray.push([command].concat(numbers));
  }
  return resultPathArray;
}

Path.fromArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    var command = array[i][0];
    var coords = array[i].slice(1, array[i].length);
    array[i] = command + coords.join(',');
  }
  this.setAttribute('d', array.join(' '));
  return this;
}

Path.translate = function (x, y) {
  var pathArray = this.toArray();
  for (var i = pathArray.length; i--;) {
    if (pathArray[i].length == 1) continue;
    pathArray[i] = pathArray[i].map(function (num, i) {
      if (i == 0) return num;
      return num + ((i % 2) ? x : y); // translate x and y coordinates
    });
  }
  this.fromArray(pathArray);

  var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
  if (rotate != undefined) {
    ElementTransformer.setTransformAttribute(this, 'rotate', rotate[0] + ' ' + (rotate[1] + x) + ' ' + (rotate[2] + y));
  }
  return this;
}

Path.scale = function (width, height) {
  var posBefore = this.getPosition();
  var pathArray = this.toArray();
  for (var i = pathArray.length; i--;) {
    if (pathArray[i].length == 1) continue;
    pathArray[i] = pathArray[i].map(function (num, i) {
      if (i == 0) return num;
      return num * ((i % 2) ? width : height); // scale x and y coordinates
    });
  }
  this.fromArray(pathArray);

  var posAfter = this.getPosition();
  var diffX = posAfter.x - posBefore.x;
  var diffY = posAfter.y - posBefore.y;
  this.translate(-diffX, -diffY);
  var rotate = ElementTransformer.getTransformAttribute(this, 'rotate');
  if (rotate != undefined) {
    this.rotate(rotate[0]);
  }
  return this;
}

Path.getPosition = function () {
  var pathArray = this.toArray();
  var minX = undefined;
  var minY = undefined;

  for (var i = 0; i < pathArray.length; i++) {
    var currPart = pathArray[i];
    var currPartMinX = undefined;
    var currPartMinY = undefined;
    for (var j = 1; j < currPart.length; j++) {
      if (j % 2) { //if it x value
        currPartMinX = (currPartMinX == undefined) ? currPart[j] : ((currPart[j] < currPartMinX) ? currPart[j] : currPartMinX);
      } else { //if it y value
        currPartMinY = (currPartMinY == undefined) ? currPart[j] : ((currPart[j] < currPartMinY) ? currPart[j] : currPartMinY);
      }
    }
    minX = (minX == undefined) ? currPartMinX : ((currPartMinX < minX) ? currPartMinX : minX);
    minY = (minY == undefined) ? currPartMinY : ((currPartMinY < minY) ? currPartMinY : minY);
  }

  return {
    x: minX,
    y: minY
  }
}

Path.getSize = function () {
  var pathArray = this.toArray();
  var maxX = undefined;
  var maxY = undefined;

  for (var i = 0; i < pathArray.length; i++) {
    var currPart = pathArray[i];
    var currPartMaxX = undefined;
    var currPartMaxY = undefined;
    for (var j = 1; j < currPart.length; j++) {
      if (j % 2) { //if it x value
        currPartMaxX = (currPartMaxX == undefined) ? currPart[j] : ((currPart[j] > currPartMaxX) ? currPart[j] : currPartMaxX);
      } else { //if it y value
        currPartMaxY = (currPartMaxY == undefined) ? currPart[j] : ((currPart[j] > currPartMaxY) ? currPart[j] : currPartMaxY);
      }
    }
    maxX = (maxX == undefined) ? currPartMaxX : ((currPartMaxX > maxX) ? currPartMaxX : maxX);
    maxY = (maxY == undefined) ? currPartMaxY : ((currPartMaxY > maxY) ? currPartMaxY : maxY);
  }

  var pos = this.getPosition();
  return {
    width: maxX - pos.x,
    height: maxY - pos.y
  }
}

Path.setPosition = function (x, y) {
  var oldPos = this.getPosition();
  var dx = x - oldPos.x;
  var dy = y - oldPos.y;
  this.translate(dx, dy);
  return this;
}

Path.setSize = function (width, height) {
  var oldSize = this.getSize();
  this.scale(width / oldSize.width, height / oldSize.height);
  return this;
}

Path.rotate = function (angle) {
  var elPos = this.getPosition();
  var elSize = this.getSize();
  var centerCoordinates = new Coordinates(
    elPos.x + elSize.width / 2,
    elPos.y + elSize.height / 2
  );
  ElementTransformer.rotate(this, centerCoordinates, angle);
  return this;
}

export default Path;
