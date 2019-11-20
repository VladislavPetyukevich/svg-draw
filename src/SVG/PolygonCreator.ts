import { SVGElementsCreator } from './StateToSvg';

export const polygonCreator: SVGElementsCreator = (element) => {
  const newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  if (!element.points) {
    throw new Error('Polygon points are not specified');
  }
  const pointsWithoutSpaces = element.points.split(' ').join(',');

  const getPointsValues = (points: number[], isXValues: boolean) =>
    points.filter((_, index) => !(index % 2) === isXValues);

  const allPoints = pointsWithoutSpaces.split(',').map(point => +point);
  const xPoints = getPointsValues(allPoints, true);
  const yPoints = getPointsValues(allPoints, false);

  const polygonX = Math.min.apply(undefined, xPoints);
  const polygonWidth = Math.max.apply(undefined, xPoints) - polygonX;
  const polygonY = Math.min.apply(undefined, yPoints);
  const polygonHeight = Math.max.apply(undefined, yPoints) - polygonY;

  const scaleX = element.width / polygonWidth;
  const scaleY = element.height / polygonHeight;

  const translatePoints = (points: number[], translateX: number, translateY: number) =>
    points.map(
      (point, index) => (index % 2 === 0) ? point + translateX : point + translateY
    );

  const scalePoints = (points: number[], scaleX: number, scaleY: number) =>
    points.map(
      (point, index) => (index % 2 === 0) ? point * scaleX : point * scaleY
    );

  const scaledPolygon = scalePoints(allPoints, scaleX, scaleY);

  const newPolygonX = Math.min.apply(undefined, getPointsValues(scaledPolygon, true));
  const newPolygonY = Math.min.apply(undefined, getPointsValues(scaledPolygon, false));
  const translatedPolygon = translatePoints(scaledPolygon, element.x - newPolygonX, element.y - newPolygonY);

  newCircle.setAttribute('points', `${translatedPolygon.join(',')}`);
  return newCircle;
};
