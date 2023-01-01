import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import {
  PROJECT_ID,
  SPEECH_TO_TEXT_SA_CLIENT_EMAIL,
  SPEECH_TO_TEXT_SA_PRIVATE_KEY,
} from '../config';

const client = new TextToSpeechClient({
  credentials: {
    client_email: SPEECH_TO_TEXT_SA_CLIENT_EMAIL,
    private_key: SPEECH_TO_TEXT_SA_PRIVATE_KEY,
  },
  projectId: PROJECT_ID,
});

export const transcriptText = async (userId: string, text: string) => {
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

  return buffer;
};
