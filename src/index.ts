import { createSvgEditor } from './SvgEditor';
import { initialState } from './State';
import { addElement, setElementParameters } from './Action';
import { stateToSvg, combineSVGElementCreators } from './SVG/StateToSvg';
import { rectCreator } from './SVG/RectCreator';
import { ellipseCreator } from './SVG/EllipseCreator';
import { circleCreator } from './SVG/CircleCreator';
import { lineCreator } from './SVG/LineCreator';
import { polygonCreator } from './SVG/PolygonCreator';
import { commonFieldsWrapper } from './SVG/CommonFieldsWrapper';
import { pointsPropertyWrapper } from './SVG/PointsPropertyWrapper';

const svgElementCreators = {
  rect: commonFieldsWrapper(rectCreator),
  ellipse: commonFieldsWrapper(ellipseCreator),
  circle: commonFieldsWrapper(circleCreator),
  line: commonFieldsWrapper(lineCreator),
  polygon: commonFieldsWrapper(pointsPropertyWrapper(polygonCreator))
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
