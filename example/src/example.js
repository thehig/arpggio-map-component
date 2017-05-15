const React = require('react');
const ReactDOM = require('react-dom');
const ArpggioMapComponent = require('arpggio-map-component'); //eslint-disable-line

const App = () => (<div> <ArpggioMapComponent /> </div>);

ReactDOM.render(<App />, document.getElementById('app'));
