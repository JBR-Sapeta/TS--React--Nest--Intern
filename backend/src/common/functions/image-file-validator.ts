import { BadRequestException } from '@nestjs/common';
import { isNil } from 'ramda';

export function imageFileValidator(
  file: Express.Multer.File,
  fileSize: number,
) {
  if (isNil(file)) return;

  if (file.size > fileSize) {
    const sizeInMB = fileSize / (1024 * 1024);
    throw new BadRequestException({
      statusCode: 400,
      message: {
        file: `Plik nie może być większy niż ${sizeInMB.toFixed(1)} MB.`,
      },
      error: 'Bad Request',
    });
  }
}
