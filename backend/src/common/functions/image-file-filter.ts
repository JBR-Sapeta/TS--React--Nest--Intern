import { BadRequestException } from '@nestjs/common';

export function imageFileFilter(
  request: Express.Request,
  file: Express.Multer.File,
  callback,
): string {
  const [type, subType] = file.mimetype.split('/');

  if (type !== 'image' || !subType.match(/(jpg|jpeg|png|webp)/)) {
    return callback(
      new BadRequestException({
        statusCode: 400,
        message: {
          file: 'Tylko formaty jpg,jpeg,png oraz webp są wspierane.',
        },
        error: 'Bad Request',
      }),
      false,
    );
  }

  callback(null, true);
}
