import { createSvgEditor } from './SvgEditor';
import { initialState } from './State';
import { addElement, setElementParameters, addElementParameters } from './Action';
import { stateToSvg, combineSVGElementCreators } from './SVG/StateToSvg';
import { rectCreator } from './SVG/RectCreator';
import { ellipseCreator } from './SVG/EllipseCreator';
import { circleCreator } from './SVG/CircleCreator';
import { lineCreator } from './SVG/LineCreator';
import { polygonCreator } from './SVG/PolygonCreator';
import { polylineCreator } from './SVG/PolylineCreator';
import { groupCreator } from './SVG/GroupCreator';
import { commonPropertiesWrapper } from './SVG/CommonPropertiesWrapper';
import { pointsPropertyWrapper } from './SVG/PointsPropertyWrapper';

const svgElementCreators = {
  rect: commonPropertiesWrapper(rectCreator),
  ellipse: commonPropertiesWrapper(ellipseCreator),
  circle: commonPropertiesWrapper(circleCreator),
  line: commonPropertiesWrapper(lineCreator),
  polygon: commonPropertiesWrapper(pointsPropertyWrapper(polygonCreator)),
  polyline: commonPropertiesWrapper(pointsPropertyWrapper(polylineCreator)),
  group: groupCreator
};

const stateToSvgMapper = combineSVGElementCreators(svgElementCreators);

export {
  createSvgEditor,
  initialState,
  stateToSvg,
  addElement,
  setElementParameters,
  addElementParameters,
  combineSVGElementCreators,
  rectCreator,
  ellipseCreator,
  circleCreator,
  lineCreator,
  svgElementCreators,
  stateToSvgMapper
};
