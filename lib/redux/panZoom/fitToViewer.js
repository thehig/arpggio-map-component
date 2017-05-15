import { fromJS } from 'immutable';

import { fitToViewer as fitToViewerSVG } from 'react-svg-pan-zoom';

import { FIT_TO_VIEWER } from '../common/constants';

// Action Creator
export function fitToViewer() {
  return {
    type: FIT_TO_VIEWER
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case FIT_TO_VIEWER:
      {
        const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
        return state.set('viewerValue', fromJS(fitToViewerSVG(viewerValue)));
      }
    default:
      return state;
  }
}
//# sourceMappingURL=fitToViewer.js.map