import { useEffect, useState, type ReactElement } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { Branch } from '@Data/types';

import { MapCenterPosition } from '../../../shared';

import styles from './BranchMap.module.css';

type Props = {
  currentBranch: Branch;
  branches: Branch[];
};

export function BranchMap({ currentBranch, branches }: Props): ReactElement {
  const {
    address: { long, lat },
  } = currentBranch;

  const [mapPosition, setMapPosition] = useState<[number, number]>([lat, long]);

  useEffect(() => {
    if (lat && long) setMapPosition([lat, long]);
  }, [lat, long]);

  return (
    <article className={styles.mapContainer}>
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {branches.map(({ id, name, address }) => (
          <Marker key={id} position={[address.lat, address.long]}>
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
