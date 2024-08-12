import { useEffect, useState, type ReactElement } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { DEFAULT_LOCATION, DEFAULT_ZOOM } from '@Common/constants';
import { Branch } from '@Data/types';

import { MapCenterPosition } from '../../../shared';

import styles from './BranchMap.module.css';

const BLUE_MARKER = new Icon({
  iconUrl: '/svg/blue_marker.svg',
  iconSize: [48, 48],
});

type Props = {
  currentBranch?: Branch;
  branches: Branch[];
};

export function BranchMap({ currentBranch, branches }: Props): ReactElement {
  const long = currentBranch?.address.long;
  const lat = currentBranch?.address.lat;

  const hasBranch = long && lat;

  const [mapPosition, setMapPosition] = useState<[number, number]>(
    hasBranch ? [lat, long] : DEFAULT_LOCATION.coords
  );

  useEffect(() => {
    if (lat && long) setMapPosition([lat, long]);
  }, [lat, long]);

  return (
    <article className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={hasBranch ? 13 : DEFAULT_ZOOM}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {branches.map(({ id, name, address }) => (
          <Marker
            key={id}
            position={[address.lat, address.long]}
            icon={BLUE_MARKER}
          >
            <Popup>
              <div>
                <p>{name}</p>
                <hr />
                <p> {`${address.streetName} ${address.houseNumber}`}</p>
                <p> {`${address.city} ${address.postcode}`}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapCenterPosition position={mapPosition} />
      </MapContainer>
    </article>
  );
}
