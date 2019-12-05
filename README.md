# Svg-Editor
Small js svg editor.

## Supported element types:
* rect
* ellipse
* circle
* line
* polygon
* polyline
* group

## Element properties:
**type**: ElementType; // rect, ellipse, circle, line, polygon, polyline, group  
**domId?**: string; // dom element id  
**class?**: string; // dom element class  
**x?**: number; // not used for groups  
**y?**: number; // not used for groups  
**width?**: number; // not used for groups  
**height?**: number; // not used for groups  
**points?**: string; // used for polygon and polyline  
**children?**: Partial<Element>[]; // used for group  
**fill?**: string;  
**stroke?**: string;

## Actions
**addElement** - create new element and add it to svg  
**setElementParameters** - set element parameters  
**addElementParameters** - add values for element parameters (used for x, y, width and height)  

## Example
```javascript
import { createSvgEditor, addElement, addElementParameters, setElementParameters } from 'svg-editor';

const svgContainer = document.getElementById('svgContainer');
if (!svgContainer) {
  throw new Error('svgContainer not found');
}
if (!(svgContainer instanceof SVGSVGElement)) {
  throw new Error('svgContainer are not instanse of SVGSVGElement');
}

const svgEditor = createSvgEditor(svgContainer.current);
const rect = svgEditor(addElement)({
  type: 'rect',
  x: 10,
  y: 10,
  width: 10,
  height: 10,
  fill: 'red'
});
svgEditor(setElementParameters)({
  id: rect.id,
  x: 20
});
svgEditor(addElementParameters)({
  id: rect.id,
  width: 10
});
```
Advanced exapmle in example\example.ts
