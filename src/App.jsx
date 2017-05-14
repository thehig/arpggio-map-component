import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import { MapContainer } from './components/map-container';
import { PanZoomDemo } from './components/PanZoomDemo';

class App extends PureComponent {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
  };
  static defaultProps = {
    height: 640,
    width: 480,
  };

  constructor(props) {
    super(props);
  }

  // render() {
  //   const mapContainerProps = {
  //     width: this.props.width,
  //     height: this.props.height,
  //   };

  //   return (
  //     <MapContainer {...mapContainerProps} >
  //       App
  //     </MapContainer>
  //   );
  // }
  render = () => <PanZoomDemo />;
}

export default App;
