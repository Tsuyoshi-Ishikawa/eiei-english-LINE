import { SpeechClient } from '@google-cloud/speech';
import {
  FIREBASE_DEFAULT_BUCKET,
  PROJECT_ID,
  SPEECH_TO_TEXT_SA_CLIENT_EMAIL,
  SPEECH_TO_TEXT_SA_PRIVATE_KEY,
} from '../config';
import { validateWAVFilePath } from '../utils';

const client = new SpeechClient({
  credentials: {
    client_email: SPEECH_TO_TEXT_SA_CLIENT_EMAIL,
    private_key: SPEECH_TO_TEXT_SA_PRIVATE_KEY,
  },
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
    // you have to set sampleRateHertz to deal with storage wav.
    sampleRateHertz: 16000,
    encoding: 1,
    languageCode: 'en-US',
    enableAutomaticPunctuation: true,
    model: 'phone_call',
  };
  const request = {
    audio,
    config,
  };

  const [response] = await client.recognize(request);
  const results = response.results;
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
