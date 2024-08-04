/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { isNil } from 'ramda';

import { Coords, MapLocation } from '@Common/types';
import { DEFAULT_LOCATION } from '@Common/constants';
import { DEFAULT_ZOOM } from '@Common/constants/location';
import { Address, CompanyPrewiev } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import { MapCenterPosition } from '../../../shared';

import styles from './CompaniesMap.module.css';

const RED_MARKER = new Icon({
  iconUrl: '/svg/red_marker.svg',
  iconSize: [48, 48],
});

const BLUE_MARKER = new Icon({
  iconUrl: '/svg/blue_marker.svg',
  iconSize: [48, 48],
});

type CompaniesMarkers = {
  branchId: number;
  companyId: string;
  slug: string;
  name: string;
  address: Address;
};

type Props = {
  companies: CompanyPrewiev[];
  userLocation?: Coords;
};

export function CompaniesMap({ companies, userLocation }: Props): ReactElement {
  const userLocationRef = useRef(userLocation);
  const [mapPosition, setMapPosition] = useState<MapLocation>(DEFAULT_LOCATION);

  const userLat = userLocation?.at(0);
  const userLong = userLocation?.at(1);

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

  const companiesMarkers: CompaniesMarkers[][] = useMemo(
    () =>
      Object.values(
        companies
          .flatMap(({ id: companyId, slug, branches }) => {
            const data = branches.map(({ id, address, name }) => {
              return {
                branchId: id,
                companyId,
                slug,
                name,
                address,
              };
            });

            return data;
          })
          .reduce((acc, offer) => {
            const {
              address: { long, lat },
            } = offer;
            const key = `${lat}-${long}`;

            // @ts-ignore
            if (!acc[key]) {
              // @ts-ignore
              acc[key] = [];
            }

            // @ts-ignore
            acc[key].push(offer);
            return acc;
          }, {})
      ),
    [companies]
  );

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
        {companiesMarkers.map((array) => (
          <Marker
            key={array[0].branchId}
            position={[array[0].address.lat, array[0].address.long]}
            icon={BLUE_MARKER}
          >
            <Popup>
              <div className={styles.container}>
                {array.map(({ branchId, slug, address, name }) => (
                  <div key={branchId}>
                    <div className={styles.company}>
                      <h3>{name}</h3>
                      <p> {`${address.streetName} ${address.houseNumber}`}</p>
                      <p> {`${address.city} ${address.postcode}`}</p>
                      <Link to={`${ROUTER_PATHS.COMPANIES}/${slug}`}>
                        Dane firmy
                      </Link>
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}

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
