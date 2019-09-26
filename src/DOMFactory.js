var DOMFactory = new Object();

DOMFactory.createGroup = function () {
  var newEl = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  for (var i = arguments.length; i--;) {
    if (arguments[i] == undefined) continue;
    newEl.appendChild(arguments[i]);
  }
  return newEl;
}

DOMFactory.createObject = function (type, props) {
  var newEl = document.createElementNS("http://www.w3.org/2000/svg", type);
  for (var key in props) {
    if (props[key] == undefined) continue;
    if (key == 'innerHTML') {
      newEl.appendChild(document.createTextNode(props[key]));
      continue;
    }
    newEl.setAttribute(key, props[key]);
  }
  return newEl;
}

export default DOMFactory;
