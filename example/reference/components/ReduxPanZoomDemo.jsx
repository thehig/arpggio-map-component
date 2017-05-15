import React from 'react';
// import PropTypes from 'prop-types';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionsSource from '../redux/common/actions';


class ReduxPanZoomDemo extends React.Component {
  // static propTypes = {
  //   state: PropTypes.object.isRequired,
  //   actions: PropTypes.object.isRequired,
  // };

  render() {
    const { state, actions } = this.props;
    const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
    const viewerTool = state.get('viewerTool');

    return (
      <div style={{ margin: '20px' }}>
        <button onClick={(/* event */) => actions.zoomOnViewerCenter(1.1)}>Zoom in</button>
        <button onClick={(/* event */) => actions.zoomOnViewerCenter(0.9)}>Zoom out</button>
        <button onClick={(/* event */) => actions.fitToViewer()}>Fit to viewer</button>
        <br />
        <button onClick={(/* event */) => actions.panViewer(0, -20)}>Up</button>
        <button onClick={(/* event */) => actions.panViewer(20, 0)}>Right</button>
        <button onClick={(/* event */) => actions.panViewer(0, 20)}>Down</button>
        <button onClick={(/* event */) => actions.panViewer(-20, 0)}>Left</button>
        <br />
        <button onClick={(/* event */) => actions.selectToolNone()}>Select tool none</button>
        <button onClick={(/* event */) => actions.selectToolPan()}>Select tool pan</button>
        <button onClick={(/* event */) => actions.selectToolZoomIn()}>Select tool zoom in</button>
        <button onClick={(/* event */) => actions.selectToolZoomOut()}>Select tool zoom out</button>
        <br />

        <ReactSVGPanZoom
          width={500} height={500}
          value={viewerValue} onChangeValue={value => actions.setViewerValue(value)}
          tool={viewerTool} onChangeTool={tool => actions.selectTool(tool)}
          style={{ outline: '1px solid black' }}
        >

          <svg width={800} height={800}>
            <rect x="400" y="40" width="100" height="200" fill="#4286f4" stroke="#f4f142" />
            <circle cx="108" cy="108.5" r="100" fill="#0ff" stroke="#0ff" />
            <circle cx="180" cy="209.5" r="100" fill="#ff0" stroke="#ff0" />
            <circle cx="220" cy="109.5" r="100" fill="#f0f" stroke="#f0f" />
          </svg>

        </ReactSVGPanZoom>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    state: state.data,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actionsSource }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxPanZoomDemo);
