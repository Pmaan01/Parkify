import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

const MapHelper = ({ onMapReady }) => {
  const map = useMap();
  const calledOnceRef = useRef(false);

  useEffect(() => {
    if (map && !calledOnceRef.current) {
      // Wait for the map to fully render before calling the parent
      map.whenReady(() => {
        if (!calledOnceRef.current) {
          onMapReady(map);
          calledOnceRef.current = true;
        }
      });
    }
  }, [map, onMapReady]);

  return null;
};

export default MapHelper;
