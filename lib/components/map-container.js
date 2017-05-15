import styled from 'styled-components';

const MapLayer = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
`;

export const MapContainer = styled(MapLayer)`
  background: red;
  border: 1px solid black;
`;
//# sourceMappingURL=map-container.js.map