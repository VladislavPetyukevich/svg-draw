# Svg-Editor
Small js svg editor. Supports touch screen.  

## Building
Type `grunt build` or `npm run build` for build libary.

## Testing
Type `npm test` for run tests.

## Demo
You can see live demo [here](https://beb21.neocities.org/svg/index.html) or you can run demo from libary: `npm start`

## Example Usage
```javascript
var svgEl = document.getElementsByTagName('svg')[0];
var props = {
	svg: svgEl,
	controlElementsStyles: { //Not necessary. All parameters are optional.
		size: 25, //Default value: 15
		closeButtonColor: '#ff3333', //Default value: 'red'
		rotateButtonColor: '#ff9933', //Default value: 'orange'
		resizeButtonColor: '#330000' //Default value: 'black'
	},
	cellSize: 20, //Not necessary
	step: 0.5 //Step of snapping to grid. Not necessary
};
var editor = new SvgEditor(props);
//Adding rect
var rect = editor.factory.rect(
	{ x: 40, y: 40, width: 80, height: 80, fill: '#0000FF' }
);
rect.hasControlElements = true;
rect.resizable = true;
rect.rotatable = true;
rect.snapRotateToGrid = true;
rect.snapToGrid = true;
editor.makeDraggable(rect);
editor.add(rect);
```