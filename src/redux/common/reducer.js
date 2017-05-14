import initialState from './initialState';
import { reducer as fitSelection } from '../fitSelection';
import { reducer as fitToViewer } from '../fitToViewer';
import { reducer as panViewer } from '../panViewer';
import { reducer as selectTool } from '../selectTool';
import { reducer as setViewerValue } from '../setViewerValue';
import { reducer as zoomOnViewerCenter } from '../zoomOnViewerCenter';

const reducers = [
  fitSelection,
  fitToViewer,
  panViewer,
  selectTool,
  setViewerValue,
  zoomOnViewerCenter,
];

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
