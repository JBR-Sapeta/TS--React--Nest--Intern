import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class DateParams {
  @ApiProperty({
    title: 'Start Date',
    description: 'Get logs from the date.',
    format: 'ISO-8601',
    example: '2024-05-22T10:36:31.686Z',
    required: false,
  })
  @IsOptional()
  @Matches(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?(Z|([+-]\d{2}:\d{2}))?)?$/,
    { message: `Value does not match ISO-8601 format` },
  )
  startDate?: string;

  @ApiProperty({
    title: 'Ennd Date',
    description: 'Get logs to the date.',
    format: 'ISO-8601',
    example: '2024-05-22T10:36:31.686Z',
  })
  @IsOptional()
  @Matches(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?(Z|([+-]\d{2}:\d{2}))?)?$/,
    { message: `Value does not match ISO-8601 format` },
  )
  endDate?: string;
}
