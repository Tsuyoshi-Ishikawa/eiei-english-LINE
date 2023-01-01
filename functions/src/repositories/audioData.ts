import { Bucket, GetSignedUrlConfig } from '@google-cloud/storage';
import {
  cloudConvert,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_ADMIN_PRIVATE_KEY,
  PROJECT_ID,
} from '../config';
import { getBucket } from '../repositories';
import {
  validateMP3FilePath,
  validateWAVFilePath,
  validateM4AFilePath,
} from '../utils';

export class AudioDataRepository {
  bucket: Bucket;

  constructor() {
    this.bucket = getBucket();
  }

  async getSignedM4aUrl(filename: string) {
    validateM4AFilePath(filename);

    const options: GetSignedUrlConfig = {
      action: 'read',
      expires: 600, // 10 min
    };
    const url = await this.bucket.file(filename).getSignedUrl(options);
    return url;
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

  async uploadM4aFromMP3File(m4aFilename: string, mp3Filename: string) {
    validateM4AFilePath(m4aFilename);
    validateMP3FilePath(mp3Filename);

    const job = await cloudConvert.jobs.create({
      tasks: {
        // https://cloudconvert.com/api/v2/import#import-google-cloud-storage-tasks
        'import-my-file': {
          operation: 'import/google-cloud-storage',
          project_id: PROJECT_ID,
          bucket: this.bucket.name,
          client_email: FIREBASE_ADMIN_CLIENT_EMAIL,
          private_key: FIREBASE_ADMIN_PRIVATE_KEY,
          file: mp3Filename,
        },
        // https://cloudconvert.com/api/v2/convert#convert-tasks
        'convert-my-file': {
          operation: 'convert',
          input: 'import-my-file',
          output_format: 'm4a',
        },
        // https://cloudconvert.com/api/v2/export#export-google-cloud-storage-tasks
        'export-my-file': {
          operation: 'export/google-cloud-storage',
          input: 'convert-my-file',
          project_id: PROJECT_ID,
          bucket: this.bucket.name,
          client_email: FIREBASE_ADMIN_CLIENT_EMAIL,
          private_key: FIREBASE_ADMIN_PRIVATE_KEY,
          file: m4aFilename,
        },
      },
    });

    cloudConvert.jobs.subscribeTaskEvent(job.id, 'finished', (event) => {
      // Task has finished
      console.log(event.task);
    });
  }
}
