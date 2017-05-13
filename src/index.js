import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const defaultProperties = {
  width: 640,
  height: 480,
};

ReactDOM.render(
  <App {...defaultProperties} />,
  document.getElementById('root'),
);
