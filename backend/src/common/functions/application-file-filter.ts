import { BadRequestException } from '@nestjs/common';

export function applicationFileFilter(
  request: Express.Request,
  file: Express.Multer.File,
  callback,
): string {
  if (file.mimetype !== 'application/pdf') {
    return callback(
      new BadRequestException({
        statusCode: 400,
        message: { file: 'Tylko pliki w formacie PDF są wspierane.' },
        error: 'Bad Request',
      }),
      false,
    );
  }

  callback(null, true);
}
