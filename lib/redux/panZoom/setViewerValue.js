import { fromJS } from 'immutable';

import { SET_VIEWER_VALUE } from '../common/constants';

// Action Creator
export function setViewerValue(value) {
  return {
    type: SET_VIEWER_VALUE,
    meta: {
      value
    }
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case SET_VIEWER_VALUE:
      return state.set('viewerValue', fromJS(action.meta.value));
    default:
      return state;
  }
}
//# sourceMappingURL=setViewerValue.js.map