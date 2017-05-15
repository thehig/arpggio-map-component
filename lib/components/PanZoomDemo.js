var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../redux/common/actions';

class PanZoomDemo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.Viewer = null;
  }
  componentDidMount() {
    this.Viewer.fitToViewer();
  }
  render() {
    const { counter } = this.props.data;
    const clickCounter = () => this.props.actions.sampleAction();

    const zoomIn = () => /* event */this.Viewer.zoomOnViewerCenter(1.1);
    const zoomArea = () => /* event */this.Viewer.fitSelection(40, 40, 200, 200);
    const fitToViewer = () => /* event */this.Viewer.fitToViewer();

    const onClick = event => console.log('click', event.x, event.y, event.originalEvent);
    const onMouseMove = event => console.log('move', event.x, event.y);

    return React.createElement(
      'div',
      null,
      React.createElement(
        'button',
        { onClick: clickCounter },
        'Clicks: ',
        counter
      ),
      React.createElement('hr', null),
      React.createElement(
        'button',
        { onClick: zoomIn },
        'Zoom in'
      ),
      React.createElement(
        'button',
        { onClick: zoomArea },
        'Zoom area'
      ),
      React.createElement(
        'button',
        { onClick: fitToViewer },
        'Fit'
      ),
      React.createElement('hr', null),
      React.createElement(
        ReactSVGPanZoom,
        {
          ref: Viewer => this.Viewer = Viewer,
          style: { outline: '1px solid black' },
          width: 500, height: 500,
          onClick: onClick,
          onMouseMove: onMouseMove
        },
        React.createElement(
          'svg',
          { width: 100, height: 100 },
          React.createElement('circle', { cx: '50', cy: '50', r: '40', stroke: 'green', strokeWidth: '4', fill: 'yellow' })
        )
      )
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    data: state.data
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_extends({}, actions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PanZoomDemo);
module.exports = exports['default'];
//# sourceMappingURL=PanZoomDemo.js.map