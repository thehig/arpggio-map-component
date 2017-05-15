const React = require('react');
const ReactDOM = require('react-dom');
const ArpggioMapComponent = require('arpggio-map-component');

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
