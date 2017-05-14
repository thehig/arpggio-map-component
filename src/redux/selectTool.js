import {
  TOOL_NONE,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
} from 'react-svg-pan-zoom';

import {
  SELECT_TOOL,
  SELECT_TOOL_NONE,
  SELECT_TOOL_PAN,
  SELECT_TOOL_ZOOM_IN,
  SELECT_TOOL_ZOOM_OUT,
} from './common/constants';

// Action Creator
export function selectTool(tool) {
  return {
    type: SELECT_TOOL,
    meta: {
      tool,
    },
  };
}

export function selectToolNone() {
  return {
    type: SELECT_TOOL_NONE,
  };
}

export function selectToolPan() {
  return {
    type: SELECT_TOOL_PAN,
  };
}

export function selectToolZoomIn() {
  return {
    type: SELECT_TOOL_ZOOM_IN,
  };
}

export function selectToolZoomOut() {
  return {
    type: SELECT_TOOL_ZOOM_OUT,
  };
}

// Action Reducer
export function reducer(state, action) {
  switch (action.type) {
    case SELECT_TOOL:
      return state.set('viewerTool', action.meta.tool);
    case SELECT_TOOL_NONE:
      return state.set('viewerTool', TOOL_NONE);
    case SELECT_TOOL_PAN:
      return state.set('viewerTool', TOOL_PAN);
    case SELECT_TOOL_ZOOM_IN:
      return state.set('viewerTool', TOOL_ZOOM_IN);
    case SELECT_TOOL_ZOOM_OUT:
      return state.set('viewerTool', TOOL_ZOOM_OUT);
    default:
      return state;
  }
}
