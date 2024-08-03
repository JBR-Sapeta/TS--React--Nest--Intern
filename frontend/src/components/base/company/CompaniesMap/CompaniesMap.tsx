import { useEffect, useRef, useState, type ReactElement } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { isNil } from 'ramda';

import { Coords, MapLocation } from '@Common/types';
import { DEFAULT_LOCATION } from '@Common/constants';
import { DEFAULT_ZOOM } from '@Common/constants/location';

import { MapCenterPosition } from '../../../shared';

import styles from './CompaniesMap.module.css';

const RED_MARKER = new Icon({
  iconUrl: '/svg/red_marker.svg',
  iconSize: [48, 48],
});

// @ TO-DO After api change add company markers

type Props = {
  userLocation?: Coords;
  //   currentBranch: Branch;
  //   branches: Branch[];
};

export function CompaniesMap({ userLocation }: Props): ReactElement {
  const userLocationRef = useRef(userLocation);
  // const companyLocationRef = useRef(userLocation);
  const [mapPosition, setMapPosition] = useState<MapLocation>(DEFAULT_LOCATION);

  const userLat = userLocation?.at(0);
  const userLong = userLocation?.at(1);

  // const {
  //   address: { long, lat },
  // } = currentBranch;

  useEffect(() => {
    const cachedLat = userLocationRef.current?.[0];
    const cachedLong = userLocationRef.current?.[1];

    if (
      userLat &&
      userLong &&
      cachedLat !== userLat &&
      cachedLong !== userLong
    ) {
      setMapPosition({ coords: [userLat, userLong], zoom: 13 });
      userLocationRef.current = [userLat, userLong];
    }

    if (isNil(userLat) && cachedLat) {
      setMapPosition({ ...DEFAULT_LOCATION, zoom: DEFAULT_ZOOM });
      userLocationRef.current = undefined;
    }
  }, [userLat, userLong]);

  return (
    <article className={styles.mapContainer}>
      <MapContainer
        center={mapPosition.coords}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {/* {branches.map(({ id, name, address }) => (
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
        ))} */}

        {userLocation && (
          <Marker
            position={[userLocation[0], userLocation[1]]}
            icon={RED_MARKER}
          >
            <Popup>
              <div>
                <p>Twoja lokalizacja</p>
              </div>
            </Popup>
          </Marker>
        )}
        <MapCenterPosition
          position={mapPosition.coords}
          zoom={mapPosition.zoom}
        />
      </MapContainer>
    </article>
  );
}
