import { Bucket } from '@google-cloud/storage';
import { getBucket } from '../repositories';
import { validateMP3FilePath, validateWAVFilePath } from '../utils';

export class AudioDataRepository {
  bucket: Bucket;

  constructor() {
    this.bucket = getBucket();
  }

  async uploadWAV(filename: string, buffer: Buffer) {
    validateWAVFilePath(filename);
    await this.bucket.file(filename).save(buffer, {
      contentType: 'audio/wav',
    });
  }

  async uploadMP3(filename: string, buffer: Buffer) {
    validateMP3FilePath(filename);
    await this.bucket.file(filename).save(buffer, {
      contentType: 'audio/mp3',
    });
  }
}
