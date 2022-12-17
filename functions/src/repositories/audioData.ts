import { Bucket } from '@google-cloud/storage';
import { getBucket } from '../repositories';

export class AudioDataService {
  bucket: Bucket;

  constructor() {
    this.bucket = getBucket();
  }

  async uploadFile() {
    await this.bucket.upload(
      '/opt/workspace/functions/src/repositories/auditData.ts', // todo: set file data
    );
  }
}
