import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { FIREBASE_PROJECT_ID } from '../config';
import { AudioDataService } from '../repositories';

const client = new TextToSpeechClient({
  keyFilename: process.env.SPEECH_TO_TEXT_SECRET_KEY_PATH ?? '',
  projectId: FIREBASE_PROJECT_ID,
});
const audioDataService = new AudioDataService();

export const transcript = async (userId: string, text: string) => {
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 3 },
    audioConfig: { audioEncoding: 2 },
  };

  const [response] = await client.synthesizeSpeech(request);
  const audioData = response.audioContent;

  let buffer: Buffer;
  if (typeof audioData === 'string') {
    buffer = Buffer.from(audioData, 'base64');
  } else if (audioData instanceof Uint8Array) {
    buffer = Buffer.from(audioData);
  } else {
    throw new Error('We can not answer those comment');
  }

  const now = Date.now();
  // line bot can only handle mp3 or m4a.
  const filename = `${userId}_${now}.mp3`;
  await audioDataService.uploadMP3(filename, buffer);
};