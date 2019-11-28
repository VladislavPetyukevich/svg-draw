import { initializeSvgEditor } from './SvgEditor';
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
import { idClassPropertiesWrapper } from './SVG/Wrapper/IdClassPropertiesWrapper copy';
import { colorPropertiesWrapper } from './SVG/Wrapper/ColorPropertiesWrapper';
import { pointsPropertyWrapper } from './SVG/Wrapper/PointsPropertyWrapper';
import { wrap } from './SVG/Wrapper/Wrap';

const svgElementCreators = {
  rect: wrap(rectCreator, [idClassPropertiesWrapper, colorPropertiesWrapper]),
  ellipse: wrap(ellipseCreator, [idClassPropertiesWrapper, colorPropertiesWrapper]),
  circle: wrap(circleCreator, [idClassPropertiesWrapper, colorPropertiesWrapper]),
  line: wrap(lineCreator, [idClassPropertiesWrapper, colorPropertiesWrapper]),
  polygon: wrap(polygonCreator, [idClassPropertiesWrapper, colorPropertiesWrapper, pointsPropertyWrapper]),
  polyline: wrap(polylineCreator, [idClassPropertiesWrapper, colorPropertiesWrapper, pointsPropertyWrapper]),
  group: wrap(groupCreator, [idClassPropertiesWrapper])
};

const stateToSvgMapper = combineSVGElementCreators(svgElementCreators);



export {
  initializeSvgEditor,
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
