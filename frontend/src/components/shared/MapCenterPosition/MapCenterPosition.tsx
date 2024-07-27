import { useMap } from 'react-leaflet';
import L from 'leaflet';

type ChangeMapCenterProps = {
  position: [number, number];
};

export function MapCenterPosition({ position }: ChangeMapCenterProps): null {
  const map = useMap();

  const closeAllPopups = () => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Popup) {
        map.closePopup(layer);
      }
    });
  };

  closeAllPopups();

  map.setView(position);
  return null;
}
