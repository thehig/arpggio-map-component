import { fromJS } from 'immutable';
import { zoomOnViewerCenter as zoomOnViewerCenterSVG } from 'react-svg-pan-zoom';

import { ZOOM_ON_VIEWER_CENTER } from '../common/constants';

// Action Creator
export function zoomOnViewerCenter(scaleFactor) {
  return {
    type: ZOOM_ON_VIEWER_CENTER,
    meta: {
      scaleFactor
    }
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case ZOOM_ON_VIEWER_CENTER:
      {
        const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
        return state.set('viewerValue', fromJS(zoomOnViewerCenterSVG(viewerValue, action.meta.scaleFactor)));
      }
    default:
      return state;
  }
}
//# sourceMappingURL=zoomOnViewerCenter.js.map