import { fromJS } from 'immutable';
import { pan } from 'react-svg-pan-zoom';

import {
  PAN_VIEWER,
} from '../common/constants';

// Action Creator
export function panViewer(deltaX, deltaY) {
  return {
    type: PAN_VIEWER,
    meta: {
      deltaX,
      deltaY,
    },
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case PAN_VIEWER: {
      const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
      return state.set('viewerValue', fromJS(pan(viewerValue, action.meta.deltaX, action.meta.deltaY)));
    }
    default:
      return state;
  }
}
