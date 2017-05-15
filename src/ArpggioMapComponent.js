import React, { PureComponent } from 'react';
import { ReactSVGPanZoom, TOOL_NONE } from 'react-svg-pan-zoom';
import PropTypes from 'prop-types';


class ArpggioMapComponent extends PureComponent {
  render() {
    const {
      width,
      height,
      viewerValue,
      viewerTool,
      onSetViewer,
      onChangeValue,
      onChangeTool,
    } = this.props;

    return (
      <ReactSVGPanZoom
        ref={onSetViewer}
        width={width}
        height={height}
        value={viewerValue}
        onChangeValue={onChangeValue}
        tool={viewerTool}
        onChangeTool={onChangeTool}
        style={{ outline: '1px solid black' }}
      >
        { this.props.children }
      </ReactSVGPanZoom>
    );
  }
}

ArpggioMapComponent.propTypes = {
  // viewerValue: PropTypes.object.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  onChangeTool: PropTypes.func.isRequired,
  onSetViewer: PropTypes.func,
  viewerTool: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

ArpggioMapComponent.defaultProps = {
  viewerTool: TOOL_NONE,
  width: 640,
  height: 480,
  onSetViewer: Viewer => Viewer,
};

// class App extends React.PureComponent {
//   render() {
//     const { state, actions } = this.props;

//     const viewerValue = state.get('viewerValue') ? state.get('viewerValue').toJS() : null;
//     const viewerTool = state.get('viewerTool');

//     const onZoomInClick = (/* event */) => actions.zoomOnViewerCenter(1.1);
//     const onZoomOutClick = (/* event */) => actions.zoomOnViewerCenter(0.9);
//     const onFitToViewerClick = (/* event */) => actions.fitToViewer();

//     const onPanUpClick = (/* event */) => actions.pan(0, -20);
//     const onPanRightClick = (/* event */) => actions.pan(20, 0);
//     const onPanDownClick = (/* event */) => actions.pan(0, 20);
//     const onPanLeftClick = (/* event */) => actions.pan(-20, 0);

//     const onSelectToolNoneClick = (/* event */) => actions.selectToolNone();
//     const onSelectToolPanClick = (/* event */) => actions.selectToolPan();
//     const onSelectToolZoomInClick = (/* event */) => actions.selectToolZoomIn();
//     const onSelectToolZoomOutClick = (/* event */) => actions.selectToolZoomOut();

//     const onChangeValue = value => actions.setValue(value);
//     const onChangeTool = tool => actions.selectTool(tool);

//     return (
//       <div style={{ margin: '20px' }}>
//         <button onClick={onZoomInClick}>Zoom in</button>
//         <button onClick={onZoomOutClick}>Zoom out</button>
//         <button onClick={onFitToViewerClick}>Fit to viewer</button>
//         <br />
//         <button onClick={onPanUpClick}>Up</button>
//         <button onClick={onPanRightClick}>Right</button>
//         <button onClick={onPanDownClick}>Down</button>
//         <button onClick={onPanLeftClick}>Left</button>
//         <br />
//         <button onClick={onSelectToolNoneClick}>Select tool none</button>
//         <button onClick={onSelectToolPanClick}>Select tool pan</button>
//         <button onClick={onSelectToolZoomInClick}>Select tool zoom in</button>
//         <button onClick={onSelectToolZoomOutClick}>Select tool zoom out</button>
//         <br />

//         <ReactSVGPanZoom
//           width={500}
//           height={500}
//           value={viewerValue}
//           onChangeValue={onChangeValue}
//           tool={viewerTool}
//           onChangeTool={onChangeTool}
//           style={{ outline: '1px solid black' }}
//         >

//           <svg width={800} height={800}>
//             <rect x="400" y="40" width="100" height="200" fill="#4286f4" stroke="#f4f142" />
//             <circle cx="108" cy="108.5" r="100" fill="#0ff" stroke="#0ff" />
//             <circle cx="180" cy="209.5" r="100" fill="#ff0" stroke="#ff0" />
//             <circle cx="220" cy="109.5" r="100" fill="#f0f" stroke="#f0f" />
//           </svg>

//         </ReactSVGPanZoom>
//       </div>
//     );
//   }
// }

// App.propTypes = {
//   state: PropTypes.object.isRequired,
//   actions: PropTypes.object.isRequired,
// };

export default ArpggioMapComponent;
