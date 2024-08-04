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
import { Address, OfferPreview } from '@Data/types';
import { ROUTER_PATHS } from '@Router/constants';

import { MapCenterPosition } from '../../../shared';

import styles from './OffersMap.module.css';

const RED_MARKER = new Icon({
  iconUrl: '/svg/red_marker.svg',
  iconSize: [48, 48],
});

const GREEN_MARKER = new Icon({
  iconUrl: '/svg/green_marker.svg',
  iconSize: [48, 48],
});

type OfferMarkers = {
  branchId: number;
  offerId: number;
  companyId: string;
  offerTitle: string;
  position: string;
  name: string;
  address: Address;
};

type Props = {
  userLocation?: Coords;
  offers: OfferPreview[];
};

export function OffersMap({ userLocation, offers }: Props): ReactElement {
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

  const offerMarkers: OfferMarkers[][] = useMemo(
    () =>
      Object.values(
        offers
          .flatMap((offer) => {
            const {
              id: offerId,
              title: offerTitle,
              position,
              branches,
              company: { id: companyId },
            } = offer;

            const data = branches.map(({ id, address, name }) => {
              return {
                branchId: id,
                offerId,
                companyId,
                offerTitle,
                position,
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
    [offers]
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
        {Object.values(offerMarkers).map((array) => (
          <Marker
            key={array[0].branchId + array[0].offerId}
            position={[array[0].address.lat, array[0].address.long]}
            icon={GREEN_MARKER}
          >
            <Popup>
              <div className={styles.container}>
                {array.map(
                  ({
                    offerId,
                    companyId,
                    offerTitle,
                    position,
                    address,
                    name,
                  }) => (
                    <div key={offerId}>
                      <div className={styles.offer}>
                        <h3>{offerTitle}</h3>
                        <p>{position}</p>
                        <p>{name}</p>
                        <p> {`${address.streetName} ${address.houseNumber}`}</p>
                        <p> {`${address.city} ${address.postcode}`}</p>
                        <Link
                          to={`${ROUTER_PATHS.OFFERS}/${companyId}/${offerId}`}
                        >
                          Pełana oferta
                        </Link>
                        <hr />
                      </div>
                    </div>
                  )
                )}
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
