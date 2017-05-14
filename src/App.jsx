import React from 'react';
import { Provider } from 'react-redux';
// import PropTypes from 'prop-types';
import { store } from './redux/common/store';
import ReduxPanZoomDemo from './components/ReduxPanZoomDemo';

const App = () => (
  <Provider store={store}>
    <ReduxPanZoomDemo />
  </Provider>
);

export default App;
