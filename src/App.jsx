import React, { PureComponent } from 'react'; //eslint-disable-line
// import PropTypes from 'prop-types';

// import MapContainer from './components/map-container';

class App extends PureComponent {
  static propTypes = {
    // height: PropTypes.number.isRequired,
    // width: PropTypes.number.isRequired,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        App
      </div>
    );
  }
}

export default App;
