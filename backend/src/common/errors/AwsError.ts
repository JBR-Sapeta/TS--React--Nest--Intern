import {
  DeleteObjectCommandOutput,
  GetObjectCommandOutput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

type AwsErroArguments =
  | PutObjectCommandOutput
  | GetObjectCommandOutput
  | DeleteObjectCommandOutput;

export class AwsError extends Error {
  public $metadata: any;

  constructor(error: AwsErroArguments) {
    super();
    this.$metadata = error.$metadata;
  }
}
