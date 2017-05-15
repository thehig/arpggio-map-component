import React from 'react';
import { Provider } from 'react-redux';
// import PropTypes from 'prop-types';
import { store } from './redux/common/store';
import ReduxPanZoomDemo from './components/ReduxPanZoomDemo';

const App = () => React.createElement(
  Provider,
  { store: store },
  React.createElement(ReduxPanZoomDemo, null)
);

export default App;
module.exports = exports['default'];
//# sourceMappingURL=App.js.map