import React from 'react';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';

export class PanZoomDemo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.Viewer = null;
  }
  componentDidMount() {
    this.Viewer.fitToViewer();
  }
  render() {
    const zoomIn = (/* event */) => this.Viewer.zoomOnViewerCenter(1.1);
    const zoomArea = (/* event */) => this.Viewer.fitSelection(40, 40, 200, 200);
    const fitToViewer = (/* event */) => this.Viewer.fitToViewer();

    const onClick = event => console.log('click', event.x, event.y, event.originalEvent);
    const onMouseMove = event => console.log('move', event.x, event.y);

    return (
      <div>
        <button onClick={zoomIn}>Zoom in</button>
        <button onClick={zoomArea}>Zoom area</button>
        <button onClick={fitToViewer}>Fit</button>

        <hr />

        <ReactSVGPanZoom
          ref={Viewer => (this.Viewer = Viewer)}
          style={{ outline: '1px solid black' }}
          width={500} height={500}
          onClick={onClick}
          onMouseMove={onMouseMove}
        >
          <svg width={100} height={100}>
            {/* SVG Contents */}
            <circle cx="50" cy="50" r="40" stroke="green" strokeWidth="4" fill="yellow" />
          </svg>
        </ReactSVGPanZoom>
      </div>
    );
  }
}
