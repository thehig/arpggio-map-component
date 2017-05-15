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

var App = (function (_Component) {
  _inherits(App, _Component);

  function App(props, context) {
    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, props, context);
    this.state = {
      value: null,
      tool: _reactSvgPanZoom.TOOL_NONE
    };
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.Viewer.fitToViewer();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'button',
          {
            onClick: function () {
              return (/* event */_this.setState({ value: (0, _reactSvgPanZoom.zoomOnViewerCenter)(_this.state.value, 1.1) })
              );
            }
          },
          'Zoom in'
        ),
        _react2['default'].createElement(
          'button',
          {
            onClick: function () {
              return (/* event */_this.setState({ value: (0, _reactSvgPanZoom.fitSelection)(_this.state.value, 40, 40, 200, 200) })
              );
            }
          },
          'Zoom area 200x200'
        ),
        _react2['default'].createElement(
          'button',
          {
            onClick: function () {
              return (/* event */_this.setState({ value: (0, _reactSvgPanZoom.fitToViewer)(_this.state.value) })
              );
            }
          },
          'Fit'
        ),
        _react2['default'].createElement('hr', null),
        _react2['default'].createElement(
          _reactSvgPanZoom.ReactSVGPanZoom,
          {
            width: 400,
            height: 400,
            style: { border: '1px solid black' },
            ref: function (Viewer) {
              return _this.Viewer = Viewer;
            },

            onClick: function (event) {
              return console.log('click', event.x, event.y, event.originalEvent);
            },
            onMouseUp: function (event) {
              return console.log('up', event.x, event.y);
            },
            onMouseMove: function (event) {
              return console.log('move', event.x, event.y);
            },
            onMouseDown: function (event) {
              return console.log('down', event.x, event.y);
            },

            value: this.state.value,
            onChangeValue: function (value) {
              return _this.setState({ value: value });
            },
            tool: this.state.tool,
            onChangeTool: function (tool) {
              return _this.setState({ tool: tool });
            }
          },
          _react2['default'].createElement(
            'svg',
            { width: 800, height: 800 },
            _react2['default'].createElement('rect', { x: '400', y: '40', width: '100', height: '200', fill: '#4286f4', stroke: '#f4f142' }),
            _react2['default'].createElement('circle', { cx: '108', cy: '108.5', r: '100', fill: '#0ff', stroke: '#0ff' }),
            _react2['default'].createElement('circle', { cx: '180', cy: '209.5', r: '100', fill: '#ff0', stroke: '#ff0' }),
            _react2['default'].createElement('circle', { cx: '220', cy: '109.5', r: '100', fill: '#f0f', stroke: '#f0f' })
          )
        )
      );
    }
  }]);

  return App;
})(_react.Component);

exports['default'] = App;
module.exports = exports['default'];