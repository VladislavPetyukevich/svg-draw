# Svg-Draw
Small js svg editor without dependencies.

## Supported element types:
* rect
* ellipse
* circle
* line
* polygon
* polyline
* group
* text

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
**text?**: string; // used for text  
**fontSize?**: number; // used for text  

## Actions
**addElement** - create new element and add it to svg  
**setElementParameters** - set element parameters  
**addElementParameters** - adds values for element parameters (used for x, y, width and height)  
**removeElement** - remove element from svg  

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

const svgEditor = createSvgEditor(document, svgContainer);
const svgAddElement = svgEditor(addElement);
const svgSetElementParameters = svgEditor(setElementParameters);
const svgAddElementParameters = svgEditor(addElementParameters);
const svgRemoveElement = svgEditor(removeElement);

const rect = svgAddElement({
  type: 'rect',
  x: 10,
  y: 10,
  width: 10,
  height: 10,
  fill: 'red'
});

svgSetElementParameters({
  id: rect.id,
  x: 20
});

svgAddElementParameters({
  id: rect.id,
  width: 10
});

svgRemoveElement(rect);
```
Advanced exapmle in example\example.ts
