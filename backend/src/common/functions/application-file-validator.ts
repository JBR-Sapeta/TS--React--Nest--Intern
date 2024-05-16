import { BadRequestException } from '@nestjs/common';
import { isNil } from 'ramda';

import { PL_ERRORS } from '../../locales';

export function applicationFileValidator(
  file: Express.Multer.File,
  fileSize: number,
) {
  if (isNil(file)) {
    throw new BadRequestException(PL_ERRORS.VALIDATION_FILE_NOT_PROVIDED);
  }

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
