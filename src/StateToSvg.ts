import { State } from './State';
import { Element } from './Element';

type StateToSvg = (svgContainer: SVGElement, stateToSvgMapper: StateToSvgMapper) => StateToSvgChanger;

export type StateToSvgChanger = (state: State) => void;

export type StateToSvgMapper = (element: Element) => SVGElement;

export const stateToSvg: StateToSvg = (svgContainer: SVGElement, stateToSvgMapper: StateToSvgMapper) => {
  const elementsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svgContainer.appendChild(elementsGroup);
  return (state: State) => {
    const domElements = state.elements.map(stateToSvgMapper);
    const elementsGroupInnerHTML = domElements.reduce(
      (innerHTML, element) => innerHTML += element.outerHTML,
      ''
    );
    elementsGroup.innerHTML = elementsGroupInnerHTML;
  };
};

export const stateToSvgMapper: StateToSvgMapper = (element: Element) => {
  switch (element.type) {
    case 'rect':
      const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      newRect.setAttribute('x', `${element.x}`);
      newRect.setAttribute('y', `${element.y}`);
      newRect.setAttribute('width', `${element.width}`);
      newRect.setAttribute('height', `${element.height}`);
      return newRect;
    case 'ellipse':
      const newEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      newEllipse.setAttribute('cx', `${element.x + element.width / 2}`);
      newEllipse.setAttribute('cy', `${element.y + element.height / 2}`);
      newEllipse.setAttribute('rx', `${element.width / 2}`);
      newEllipse.setAttribute('ry', `${element.height / 2}`);
      return newEllipse;
    case 'path':
      if (!element.path) {
        throw new Error('Path is not specified');
      }
      const markerRegEx = /[ML]/g;
      const digitRegEx = /-?[0-9]*\.?\d+/g;
      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const markerIndices: number[] = [];
      let match;
      while ((match = markerRegEx.exec(element.path)) !== null) {
        markerIndices.push(match.index);
      }
      const pathCommands = markerIndices.map((markerIndex, index) => {
        const marker = element.path![markerIndex];
        const valuesStartIndex = markerIndex + 1;
        const valuesEndIndex = (index === markerIndices.length - 1) ? element.path!.length : markerIndices[index + 1];
        const valuesString = element.path!.substring(valuesStartIndex, valuesEndIndex);
        const values = valuesString.match(digitRegEx)!.map(value => +value);
        return { marker, values };
      });

      const getCommandValues = (pathCommands: { marker: string, values: number[] }[], isXValues: boolean) => {
        const indexChecker = (index: number) => isXValues ? index % 2 === 0 : index % 2 !== 0;
        return pathCommands.reduce(
          (values: number[], command) => {
            const commandValues = command.values.filter((value, index) => indexChecker(index));
            return [...values, ...commandValues];
          },
          []
        );
      };

      const pathXValues = getCommandValues(pathCommands, true);
      const pathYValues = getCommandValues(pathCommands, false);

      const pathX = Math.min.apply(undefined, pathXValues);
      const pathWidth = Math.max.apply(undefined, pathXValues) - pathX;
      const pathY = Math.min.apply(undefined, pathYValues);
      const pathHeight = Math.max.apply(undefined, pathYValues) - pathY;
      const translateX = element.x - pathX;
      const translateY = element.y - pathX;
      const scaleX = element.width / pathWidth;
      const scaleY = element.height / pathHeight;

      const translatePathCommands = (pathCommands: { marker: string, values: number[] }[], translateX: number, translateY: number) =>
        pathCommands.map((command) => {
          const newValues = command.values.map(
            (value, index) => (index % 2 === 0) ? value + translateX : value + translateY
          );
          return { marker: command.marker, values: newValues };
        });

      const scalePathCommands = (pathCommands: { marker: string, values: number[] }[], scaleX: number, scaleY: number) =>
        pathCommands.map((command) => {
          const newValues = command.values.map(
            (value, index) => (index % 2 === 0) ? value * scaleX : value * scaleY
          );
          return { marker: command.marker, values: newValues };
        });

      const translatedPathCommands = translatePathCommands(pathCommands, translateX, translateY);
      const scaledPathCommands = scalePathCommands(translatedPathCommands, scaleX, scaleY);

      const newPathX = Math.min.apply(undefined, getCommandValues(scaledPathCommands, true));
      const newPathY = Math.min.apply(undefined, getCommandValues(scaledPathCommands, false));
      const newTranslatedPathCommands = translatePathCommands(scaledPathCommands, element.x - newPathX, element.y - newPathY);

      const newElementPath = newTranslatedPathCommands.reduce(
        (path, command) => `${path} ${command.marker} ${command.values.join(' ')}`,
        ''
      );
      newPath.setAttribute('d', newElementPath);
      return newPath;
    default:
      throw new Error(`Unknown element type: ${element.type}`);
  }
};
