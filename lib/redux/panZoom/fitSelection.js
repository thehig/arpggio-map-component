import { fromJS } from 'immutable';

import { FIT_SELECTION } from '../common/constants';

// Action Creator
export function fitSelection(selectionSVGPointX, selectionSVGPointY, selectionWidth, selectionHeight) {
  return {
    type: FIT_SELECTION,
    meta: {
      selectionSVGPointX,
      selectionSVGPointY,
      selectionWidth,
      selectionHeight
    }
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case FIT_SELECTION:
      {
        const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
        return state.set('viewerValue', fromJS(fitSelection(viewerValue, action.meta.selectionSVGPointX, action.meta.selectionSVGPointY, action.meta.selectionWidth, action.meta.selectionHeight)));
      }
    default:
      return state;
  }
}
//# sourceMappingURL=fitSelection.js.map