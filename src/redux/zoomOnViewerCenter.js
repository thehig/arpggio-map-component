import { fromJS } from 'immutable';
import { zoomOnViewerCenter } from 'react-svg-pan-zoom';

import {
  ZOOM_ON_VIEWER_CENTER,
} from './common/constants';

// Action Creator
export function fitSelection(scaleFactor) {
  return {
    type: ZOOM_ON_VIEWER_CENTER,
    meta: {
      scaleFactor,
    },
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case ZOOM_ON_VIEWER_CENTER: {
      const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
      return state.set('viewerValue', fromJS(zoomOnViewerCenter(viewerValue, action.meta.scaleFactor)));
    }
    default:
      return state;
  }
}
