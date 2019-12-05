import { createSvgEditor, addElement, addElementParameters } from '../src/index';

const svgContainer = document.getElementById('svgContainer');
if (!svgContainer) {
  throw new Error('svgContainer no found');
}
if (!(svgContainer instanceof SVGSVGElement)) {
  throw new Error('svgContainer are not instanse of SVGSVGElement');
}

const svgEditor = createSvgEditor(svgContainer);

const group = svgEditor(addElement)({
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
      svgEditor(addElementParameters)({
        id: group.id,
        y: 5,
      });
    },
    i * 100
  );
}

const group2 = svgEditor(addElement)({
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
      svgEditor(addElementParameters)({
        id: group2.id,
        y: 5,
        height: -5
      });
    },
    i * 100
  );
}
