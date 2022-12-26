import { SpeechClient } from '@google-cloud/speech';
import { FIREBASE_DEFAULT_BUCKET, PROJECT_ID } from '../config';
import { validateWAVFilePath } from '../utils';

const client = new SpeechClient({
  keyFilename: process.env.SPEECH_TO_TEXT_SECRET_KEY_PATH ?? '',
  projectId: PROJECT_ID,
});

export const transcriptSpeech = async (filename: string) => {
  validateWAVFilePath(filename);

  const audio = {
    // m4a and mp3 is not valid
    // https://cloud.google.com/speech-to-text/v2/docs/best-practices
    uri: `gs://${FIREBASE_DEFAULT_BUCKET}/${filename}`,
  };

  const config = {
    encoding: 1,
    languageCode: 'en-US',
    enableAutomaticPunctuation: true,
    model: 'phone_call',
  };
  const request = {
    audio,
    config,
  };

  const response = await client.recognize(request);
  const results = response[0].results;
  if (!results) throw new Error('Unable to transcribe audio');

  const transcriptionArray = results.map((result) => {
    if (!result.alternatives) throw new Error('Unable to transcribe audio');
    if (!result.alternatives[0].transcript)
      throw new Error('Unable to transcribe audio');
    return result.alternatives[0].transcript;
  });
  const userStatement = transcriptionArray.join(' ');

  console.log(`userStatement: ${userStatement}`);
  return userStatement;
};
