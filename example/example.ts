import { createSvgEditor, addElement, addElementParameters, removeElement } from '../src/index';

const svgContainer = document.getElementById('svgContainer');
if (!svgContainer) {
  throw new Error('svgContainer not found');
}
if (!(svgContainer instanceof SVGSVGElement)) {
  throw new Error('svgContainer are not instanse of SVGSVGElement');
}

const svgEditor = createSvgEditor(document, svgContainer);
const svgAddElement = svgEditor(addElement);
const svgAddElementParameters = svgEditor(addElementParameters);
const svgRemoveElement = svgEditor(removeElement);

const group = svgAddElement({
  type: 'group',
  children: [
    {
      type: 'rect',
      x: 10,
      y: 10,
      width: 10,
      height: 10,
      fill: 'red'
    },
    {
      type: 'circle',
      x: 20,
      y: 10,
      width: 10,
      height: 10,
      fill: 'green'
    },
    {
      type: 'ellipse',
      x: 30,
      y: 10,
      width: 20,
      height: 10,
      fill: 'blue'
    }
  ]
});

for (let i = 1; i <= 5; i++) {
  setTimeout(
    () => {
      svgAddElementParameters({
        id: group.id,
        y: 5,
      });
    },
    i * 100
  );
}

const group2 = svgAddElement({
  type: 'group',
  children: [
    {
      type: 'polygon',
      points: '100,100 150,25 150,75,200,0',
      x: 80,
      y: 10,
      width: 80,
      height: 80,
      fill: 'rosybrown'
    },
    {
      type: 'polyline',
      points: '0,100 50,25 50,75 100,0',
      x: 100,
      y: 40,
      width: 80,
      height: 80,
      fill: 'none',
      stroke: 'darkmagenta'
    },
    {
      type: 'line',
      x: 180,
      y: 80,
      width: -80,
      height: 80,
      stroke: 'coral'
    }
  ]
});

for (let i = 1; i <= 5; i++) {
  setTimeout(
    () => {
      svgAddElementParameters({
        id: group2.id,
        y: 5,
        height: -5
      });
    },
    i * 100
  );
}

const text = svgAddElement({
  type: 'text',
  x: 60,
  y: 20,
  text: 'Sample text',
  fontSize: 20
});

setTimeout(() => {
  svgRemoveElement(text);
}, 1000);

setTimeout(() => {
  svgAddElement(text);
}, 2000);
