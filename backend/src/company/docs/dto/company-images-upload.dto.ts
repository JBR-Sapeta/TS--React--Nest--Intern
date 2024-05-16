import { ApiProperty } from '@nestjs/swagger';

export class CompanyImagesUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  logoFile?: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  mainPhotoFile?: any;
}
