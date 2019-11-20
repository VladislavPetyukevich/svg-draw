import { SVGElementsCreator } from './StateToSvg';
import { Element } from '@/Element';

export const pointsPropertyWrapper = (elementCreator: SVGElementsCreator) =>
  (element: Element) => {
    if (!element.points) {
      throw new Error('Element points are not specified');
    }
    const newElement = elementCreator(element);
    const pointsWithoutSpaces = element.points.split(' ').join(',');

    const getPointsValues = (points: number[], isXValues: boolean) =>
      points.filter((_, index) => !(index % 2) === isXValues);

    const allPoints = pointsWithoutSpaces.split(',').map(point => +point);
    const xPoints = getPointsValues(allPoints, true);
    const yPoints = getPointsValues(allPoints, false);

    const pointsX = Math.min.apply(undefined, xPoints);
    const pointsWidth = Math.max.apply(undefined, xPoints) - pointsX;
    const pointsY = Math.min.apply(undefined, yPoints);
    const pointsHeight = Math.max.apply(undefined, yPoints) - pointsY;

    const scaleX = element.width / pointsWidth;
    const scaleY = element.height / pointsHeight;

    const translatePoints = (points: number[], translateX: number, translateY: number) =>
      points.map(
        (point, index) => (index % 2 === 0) ? point + translateX : point + translateY
      );

    const scalePoints = (points: number[], scaleX: number, scaleY: number) =>
      points.map(
        (point, index) => (index % 2 === 0) ? point * scaleX : point * scaleY
      );

    const scaledPoints = scalePoints(allPoints, scaleX, scaleY);

    const newPointsX = Math.min.apply(undefined, getPointsValues(scaledPoints, true));
    const newPointsY = Math.min.apply(undefined, getPointsValues(scaledPoints, false));
    const translatedPoints = translatePoints(scaledPoints, element.x - newPointsX, element.y - newPointsY);

    newElement.setAttribute('points', `${translatedPoints.join(',')}`);
    return newElement;
  };
