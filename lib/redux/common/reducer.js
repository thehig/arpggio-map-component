import initialState from './initialState';
import { reducer as fitSelection } from '../panZoom/fitSelection';
import { reducer as fitToViewer } from '../panZoom/fitToViewer';
import { reducer as panViewer } from '../panZoom/panViewer';
import { reducer as selectTool } from '../panZoom/selectTool';
import { reducer as setViewerValue } from '../panZoom/setViewerValue';
import { reducer as zoomOnViewerCenter } from '../panZoom/zoomOnViewerCenter';

const reducers = [fitSelection, fitToViewer, panViewer, selectTool, setViewerValue, zoomOnViewerCenter];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
module.exports = exports['default'];
//# sourceMappingURL=reducer.js.map