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
import { commonPropertiesWrapper } from './SVG/Wrapper/CommonPropertiesWrapper';
import { pointsPropertyWrapper } from './SVG/Wrapper/PointsPropertyWrapper';
import { wrap } from './SVG/Wrapper/Wrap';

const svgElementCreators = {
  rect: wrap(rectCreator, [commonPropertiesWrapper]),
  ellipse: wrap(ellipseCreator, [commonPropertiesWrapper]),
  circle: wrap(circleCreator, [commonPropertiesWrapper]),
  line: wrap(lineCreator, [commonPropertiesWrapper]),
  polygon: wrap(polygonCreator, [commonPropertiesWrapper, pointsPropertyWrapper]),
  polyline: wrap(polylineCreator, [commonPropertiesWrapper, pointsPropertyWrapper]),
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
