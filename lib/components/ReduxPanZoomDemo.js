var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

    return React.createElement(
      'div',
      { style: { margin: '20px' } },
      React.createElement(
        'button',
        { onClick: () => /* event */actions.zoomOnViewerCenter(1.1) },
        'Zoom in'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.zoomOnViewerCenter(0.9) },
        'Zoom out'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.fitToViewer() },
        'Fit to viewer'
      ),
      React.createElement('br', null),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.panViewer(0, -20) },
        'Up'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.panViewer(20, 0) },
        'Right'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.panViewer(0, 20) },
        'Down'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.panViewer(-20, 0) },
        'Left'
      ),
      React.createElement('br', null),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.selectToolNone() },
        'Select tool none'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.selectToolPan() },
        'Select tool pan'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.selectToolZoomIn() },
        'Select tool zoom in'
      ),
      React.createElement(
        'button',
        { onClick: () => /* event */actions.selectToolZoomOut() },
        'Select tool zoom out'
      ),
      React.createElement('br', null),
      React.createElement(
        ReactSVGPanZoom,
        {
          width: 500, height: 500,
          value: viewerValue, onChangeValue: value => actions.setViewerValue(value),
          tool: viewerTool, onChangeTool: tool => actions.selectTool(tool),
          style: { outline: '1px solid black' }
        },
        React.createElement(
          'svg',
          { width: 800, height: 800 },
          React.createElement('rect', { x: '400', y: '40', width: '100', height: '200', fill: '#4286f4', stroke: '#f4f142' }),
          React.createElement('circle', { cx: '108', cy: '108.5', r: '100', fill: '#0ff', stroke: '#0ff' }),
          React.createElement('circle', { cx: '180', cy: '209.5', r: '100', fill: '#ff0', stroke: '#ff0' }),
          React.createElement('circle', { cx: '220', cy: '109.5', r: '100', fill: '#f0f', stroke: '#f0f' })
        )
      )
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    state: state.data
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_extends({}, actionsSource), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxPanZoomDemo);
module.exports = exports['default'];
//# sourceMappingURL=ReduxPanZoomDemo.js.map