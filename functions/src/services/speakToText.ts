import { SpeechClient } from '@google-cloud/speech';
import { FIREBASE_DEFAULT_BUCKET, FIREBASE_PROJECT_ID } from '../config';

const client = new SpeechClient({
  keyFilename: process.env.SPEECH_TO_TEXT_SECRET_KEY_PATH ?? '',
  projectId: FIREBASE_PROJECT_ID,
});

export const transcript = async (filename: string) => {
  const audio = {
    // m4a and mp3 is not valid
    // https://cloud.google.com/speech-to-text/v2/docs/best-practices
    uri: `gs://${FIREBASE_DEFAULT_BUCKET}/${filename}.wav`,
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

  try {
    const response = await client.recognize(request);
    const results = response[0].results;
    if (!results) throw new Error('Unable to transcribe audio');

    const transcriptionArray = results.map((result) => {
      if (!result.alternatives) throw new Error('Unable to transcribe audio');
      if (!result.alternatives[0].transcript)
        throw new Error('Unable to transcribe audio');
      return result.alternatives[0].transcript;
    });
    const transcription = transcriptionArray.join(' ');

    console.log(`Transcription: ${transcription}`);
  } catch (err) {
    console.error('ERROR:', err);
  }
};
