import { Bucket } from '@google-cloud/storage';
import { getBucket } from '../repositories';

export class AudioDataService {
  bucket: Bucket;

  constructor() {
    this.bucket = getBucket();
  }

  async uploadWAV() {
    await this.bucket.upload(
      '/opt/workspace/functions/src/static/introduce.wav', // todo: set file data
    );
  }

  async uploadMP3(filename: string, buffer: Buffer) {
    await this.bucket.file(filename).save(buffer, {
      contentType: 'audio/mp3',
    });
  }
}
