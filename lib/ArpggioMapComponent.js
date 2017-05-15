'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSvgPanZoom = require('react-svg-pan-zoom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var ArpggioMapComponent = (function (_PureComponent) {
  _inherits(ArpggioMapComponent, _PureComponent);

  function ArpggioMapComponent() {
    _classCallCheck(this, ArpggioMapComponent);

    _get(Object.getPrototypeOf(ArpggioMapComponent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ArpggioMapComponent, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var width = _props.width;
      var height = _props.height;
      var viewerValue = _props.viewerValue;
      var viewerTool = _props.viewerTool;
      var onSetViewer = _props.onSetViewer;
      var onChangeValue = _props.onChangeValue;
      var onChangeTool = _props.onChangeTool;

      return _react2['default'].createElement(
        _reactSvgPanZoom.ReactSVGPanZoom,
        {
          ref: onSetViewer,
          width: width,
          height: height,
          value: viewerValue,
          onChangeValue: onChangeValue,
          tool: viewerTool,
          onChangeTool: onChangeTool,
          style: { outline: '1px solid black' }
        },
        this.props.children
      );
    }
  }]);

  return ArpggioMapComponent;
})(_react.PureComponent);

ArpggioMapComponent.propTypes = {
  // viewerValue: PropTypes.object.isRequired,
  onChangeValue: _propTypes2['default'].func.isRequired,
  onChangeTool: _propTypes2['default'].func.isRequired,
  onSetViewer: _propTypes2['default'].func,
  viewerTool: _propTypes2['default'].string,
  width: _propTypes2['default'].number,
  height: _propTypes2['default'].number
};

ArpggioMapComponent.defaultProps = {
  viewerTool: _reactSvgPanZoom.TOOL_NONE,
  width: 640,
  height: 480,
  onSetViewer: function onSetViewer(Viewer) {
    return Viewer;
  }
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

exports['default'] = ArpggioMapComponent;
module.exports = exports['default'];