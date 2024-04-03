import {
  BadGatewayException,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PL_ERRORS } from '../locales';
import { GeocoderServiceAbstractClass } from '../common/classes';
import { ENV_KEYS } from '../common/constants';
import { GeocoderAddress } from '../common/types';

@Injectable()
export class GeocoderService extends GeocoderServiceAbstractClass {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  public async validateAddress({
    country,
    region,
    postcode,
    city,
    streetName,
    houseNumber,
    latitude,
    longitude,
  }: GeocoderAddress): Promise<boolean> {
    const apiUrl = this.configService.get<string>(ENV_KEYS.GEOCODER_URL);
    const token = this.configService.get<string>(ENV_KEYS.GEOCODER_TOKEN);
    const query = encodeURI(
      `${country}${region}${postcode}${city}${streetName}${houseNumber}`,
    );
    const url = `${apiUrl}${query}.json?types=address&language=pl&limit=10&access_token=${token}`;

    let hasMatch = false;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const body = await response.json();
        this.logger.error(
          GeocoderService.name + ' - validateAddress',
          body.message || `HTTP error! status: ${response.status}`,
        );
        throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_ADDRESS_VALIDATION);
      }

      const data = await response.json();
      const locations = data.features;

      for (const location of locations) {
        const countryPattern = new RegExp(country);
        const regionPattern = new RegExp(region);
        const postcodePattern = new RegExp(postcode);
        const cityPattern = new RegExp(city);
        const streetNamePattern = new RegExp(streetName);
        const houseNumberPattern = new RegExp(houseNumber);
        const long = location.geometry.coordinates[0];
        const lat = location.geometry.coordinates[1];

        if (
          countryPattern.test(location.place_name_pl) &&
          regionPattern.test(location.place_name_pl) &&
          postcodePattern.test(location.place_name_pl) &&
          cityPattern.test(location.place_name_pl) &&
          streetNamePattern.test(location.place_name_pl) &&
          houseNumberPattern.test(location.place_name_pl) &&
          latitude === lat &&
          longitude === long
        ) {
          hasMatch = true;
          break;
        }
      }
    } catch (error) {
      this.logger.error(
        GeocoderService.name + ' - validateAddress',
        error.stack,
      );
      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_ADDRESS_VALIDATION);
    }

    return hasMatch;
  }
}
