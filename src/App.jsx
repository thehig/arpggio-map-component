import React from 'react';
import { Provider } from 'react-redux';
// import PropTypes from 'prop-types';
import { store } from './redux/common/store';
import PanZoomDemo from './components/PanZoomDemo';

const App = () => (
  <Provider store={store}>
    <div className="container">
      <PanZoomDemo />
    </div>
  </Provider>
);

export default App;
