/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import type { Nullable, Optional } from '@Common/types';

import type {
  BaseError,
  Branch,
  GeocoderData,
  GeocoderResponse,
} from '../../types';

function convertGeocoderDataToBranchesData(data: GeocoderData[]): Branch[] {
  return data.map((location) => {
    const long = location.geometry.coordinates[0];
    const lat = location.geometry.coordinates[1];

    const [address, postAddres, region, country] =
      location.place_name_pl.split(',');

    const streetName = address.split(' ').slice(0, -1).join(' ');
    const houseNumber = address.split(' ').slice(-1)[0];
    const postcode = postAddres.split(' ')[1];
    const city = postAddres.split(' ')[2];

    return {
      id: location.id,
      name: `${streetName} ${houseNumber}, ${city} ${postcode}, ${country}`,
      address: {
        id: location.id,
        country: country.trim() || '',
        region: region.trim() || '',
        postcode: postcode.trim() || '',
        city: city.trim() || '',
        streetName: streetName.trim() || '',
        houseNumber: houseNumber.trim() || '',
        long,
        lat,
      },
      createdAt: '',
    };
  });
}

type GetGeocoderDataProps = {
  country: string;
  postcode: string;
  city: string;
  streetName: string;
  houseNumber: string;
};

export async function sendGetGeocoderData({
  country,
  postcode,
  city,
  streetName,
  houseNumber,
}: GetGeocoderDataProps): Promise<Branch[]> {
  const query = encodeURI(
    `${country} ${postcode} ${city} ${streetName} ${houseNumber}`
  );

  const { data } = await axios.get<GeocoderResponse>(
    `${import.meta.env.VITE_GEOCODER_URL}${query}.json?types=address&language=pl&limit=5&access_token=${import.meta.env.VITE_GEOCODER_TOKEN}`
  );

  return convertGeocoderDataToBranchesData(data.features);
}

type UseGetGeocoderData = {
  isPending: boolean;
  data?: Optional<Branch[]>;
  error: Nullable<AxiosError<BaseError>>;
  getGeocoderData: UseMutateFunction<
    Optional<Branch[]>,
    AxiosError<BaseError>,
    GetGeocoderDataProps,
    unknown
  >;
};

export function useGetGeocoderData(): UseGetGeocoderData {
  const { enqueueSnackbar } = useSnackbar();

  const {
    isPending,
    data,
    error,
    mutate: getGeocoderData,
  } = useMutation<
    Optional<Branch[]>,
    AxiosError<BaseError>,
    GetGeocoderDataProps,
    unknown
  >({
    mutationFn: (params) => sendGetGeocoderData(params),
    onSuccess: (res) => {
      if (res) {
        enqueueSnackbar({
          message: 'Wybierz addres i stwórz oddział.',
          variant: 'success',
        });
      }
    },
    onError: (res) => {
      enqueueSnackbar({
        message: res.message,
        variant: 'error',
      });
    },
  });

  return { isPending, data, error, getGeocoderData };
}
