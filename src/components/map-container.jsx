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

export const TerrainLayer = styled(MapLayer)`
`;

export const FogLayer = styled(MapLayer)`
`;

export const GridLayer = styled(MapLayer)`
`;

export const TokensLayer = styled(MapLayer)`
`;

export const AnnotationsLayer = styled(MapLayer)`
`;
