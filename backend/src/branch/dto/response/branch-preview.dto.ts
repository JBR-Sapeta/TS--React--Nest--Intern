import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BranchEntity } from '../../../entities';
import { transformDate } from '../../../common/functions';

import { AddressPreviewDto } from './address-preview.dto';

export class BranchPreviewDto {
  @ApiProperty({ example: '67e42ba9-33df-4244-82a9-fe977293ab20' })
  @Expose()
  public id: number;

  @ApiProperty({ example: 'New Company Boston' })
  @Expose()
  public name: string;

  @ApiProperty({ example: '2024-05-02T19:21:48.626Z' })
  @Expose()
  public createdAt: string;

  @ApiProperty()
  @Expose()
  public address: AddressPreviewDto;

  constructor({ id, name, createdAt, address }: BranchEntity) {
    this.id = id;
    this.name = name;
    this.createdAt = transformDate(createdAt);
    this.address = new AddressPreviewDto(address);
  }
}
