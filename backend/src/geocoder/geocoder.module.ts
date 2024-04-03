import { Logger, Module } from '@nestjs/common';
import { GeocoderService } from './geocoder.service';

@Module({
  providers: [Logger, GeocoderService],
  exports: [GeocoderService],
})
export class GeocoderModule {}
