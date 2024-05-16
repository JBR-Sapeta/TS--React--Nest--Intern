import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import {
  BadGatewayException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEYS } from '../common/constants';
import { AwsError } from '../common/errors';
import { PL_ERRORS } from '../locales';

@Injectable()
export class S3Service {
  private applicationsBucket: string;
  private imageBucket: string;
  private region: string;
  private s3: S3Client;

  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private configService: ConfigService,
  ) {
    this.applicationsBucket = this.configService.get<string>(
      ENV_KEYS.AWS_S3_APPLICATION_BUCKET,
    );
    this.imageBucket = this.configService.get<string>(
      ENV_KEYS.AWS_S3_IMAGE_BUCKET,
    );
    this.region = configService.get<string>(ENV_KEYS.AWS_S3_REGION);
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>(ENV_KEYS.AWS_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get<string>(
          ENV_KEYS.AWS_SECRET_ACCESS_KEY,
        ),
      },
    });
  }

  // ----------------------------------------------------------------------- \\
  public async uploadApplicationFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<string> {
    try {
      const response = await this.s3.send(
        new PutObjectCommand({
          Body: file.buffer,
          Bucket: this.applicationsBucket,
          Key: key,
          ContentType: file.mimetype,
          ACL: 'private',
        }),
      );

      if (response.$metadata.httpStatusCode === HttpStatus.OK) {
        return key;
      } else {
        throw new AwsError(response);
      }
    } catch (error) {
      this.logger.error(
        S3Service.name + ' - uploadApplicationFile',
        error.$metadata,
      );

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_FILE_UPLOAD);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async getApplicationFile(
    key: string,
  ): Promise<{ data: Uint8Array; contentType: string }> {
    try {
      const response = await this.s3.send(
        new GetObjectCommand({ Bucket: this.applicationsBucket, Key: key }),
      );

      if (response.$metadata.httpStatusCode === HttpStatus.OK) {
        const data = await response.Body.transformToByteArray();
        const contentType = response.ContentType;

        return { data, contentType };
      } else {
        throw new AwsError(response);
      }
    } catch (error) {
      this.logger.error(
        S3Service.name + ' - deleteApplicationFile',
        error.$metadata,
      );

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_FILE_UPLOAD);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteApplicationFile(key: string): Promise<void> {
    try {
      const response = await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.applicationsBucket, Key: key }),
      );

      if (response.$metadata.httpStatusCode !== HttpStatus.NO_CONTENT) {
        throw new AwsError(response);
      }
    } catch (error) {
      this.logger.error(
        S3Service.name + ' - deleteApplicationFile',
        error.$metadata,
      );

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_FILE_UPLOAD);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async uploadImageFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<string> {
    try {
      const response = await this.s3.send(
        new PutObjectCommand({
          Body: file.buffer,
          Bucket: this.imageBucket,
          Key: key,
          ContentType: file.mimetype,
        }),
      );

      if (response.$metadata.httpStatusCode === HttpStatus.OK) {
        return `https://${this.imageBucket}.s3.${this.region}.amazonaws.com/${key}`;
      } else {
        throw new AwsError(response);
      }
    } catch (error) {
      this.logger.error(S3Service.name + ' - uploadImageFile', error.$metadata);

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_FILE_UPLOAD);
    }
  }

  // ----------------------------------------------------------------------- \\
  public async deleteImageFile(imageUrl: string): Promise<void> {
    const key = this.getKeyFromUrl(imageUrl);
    try {
      const response = await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.imageBucket, Key: key }),
      );

      if (response.$metadata.httpStatusCode !== HttpStatus.NO_CONTENT) {
        throw new AwsError(response);
      }
    } catch (error) {
      this.logger.error(S3Service.name + ' - deleteImageFile', error.$metadata);

      throw new BadGatewayException(PL_ERRORS.BAD_GATEWAY_FILE_UPLOAD);
    }
  }

  // ----------------------------------------------------------------------- \\
  public getKeyFromUrl(imageUrl: string): string {
    const [, key] = imageUrl.split('.amazonaws.com/');
    return key;
  }
}
