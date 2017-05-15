const React = require('react');
const ReactDOM = require('react-dom');
const ArpggioMapComponent = require('arpggio-map-component'); //eslint-disable-line

const App = React.createClass({
  render() {
    return (
      <div>
        <ArpggioMapComponent />
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
