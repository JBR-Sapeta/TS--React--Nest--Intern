import { useMap } from 'react-leaflet';
import L from 'leaflet';

type Props = {
  position: [number, number];
  zoom?: number;
};

export function MapCenterPosition({ position, zoom }: Props): null {
  const map = useMap();

  const closeAllPopups = () => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Popup) {
        map.closePopup(layer);
      }
    });
  };

  closeAllPopups();

  map.setView(position, zoom);
  return null;
}
