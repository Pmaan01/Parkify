import { useMapEvent } from 'react-leaflet';

const MapClickCloser = ({ onClose }) => {
  useMapEvent('click', () => {
    if (onClose) onClose();
  });
  return null;
};

export default MapClickCloser;
