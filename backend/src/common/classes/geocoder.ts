import { GeocoderAddress } from '../types';

export abstract class GeocoderServiceAbstractClass {
  abstract validateAddress(address: GeocoderAddress): Promise<boolean>;
}
