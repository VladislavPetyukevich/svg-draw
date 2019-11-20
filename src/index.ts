import { createSvgEditor } from './SvgEditor';
import { initialState } from './State';
import { addElement, setElementParameters } from './Action';
import { stateToSvg, combineSVGElementCreators } from './SVG/StateToSvg';
import { rectCreator } from './SVG/RectCreator';
import { ellipseCreator } from './SVG/EllipseCreator';
import { circleCreator } from './SVG/CircleCreator';
import { lineCreator } from './SVG/LineCreator';
import { polygonCreator } from './SVG/PolygonCreator';
import { polylineCreator } from './SVG/PolylineCreator';
import { colorPropertiesWrapper } from './SVG/ColorPropertiesWrapper';
import { pointsPropertyWrapper } from './SVG/PointsPropertyWrapper';

const svgElementCreators = {
  rect: colorPropertiesWrapper(rectCreator),
  ellipse: colorPropertiesWrapper(ellipseCreator),
  circle: colorPropertiesWrapper(circleCreator),
  line: colorPropertiesWrapper(lineCreator),
  polygon: colorPropertiesWrapper(pointsPropertyWrapper(polygonCreator)),
  polyline: colorPropertiesWrapper(pointsPropertyWrapper(polylineCreator))
};

const stateToSvgMapper = combineSVGElementCreators(svgElementCreators);

export {
  createSvgEditor,
  initialState,
  stateToSvg,
  addElement,
  setElementParameters,
  combineSVGElementCreators,
  rectCreator,
  ellipseCreator,
  circleCreator,
  lineCreator,
  svgElementCreators,
  stateToSvgMapper
};
