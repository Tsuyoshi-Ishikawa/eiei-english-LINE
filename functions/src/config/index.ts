import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { Configuration, OpenAIApi } from 'openai';
import { Deepgram } from '@deepgram/sdk';
import dotenv from 'dotenv';

dotenv.config();

export const IS_DEV = process.env.IS_DEV ?? true;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY ?? '';
export const openai = new OpenAIApi(configuration);
export const deepgram = new Deepgram(DEEPGRAM_API_KEY);

export const FIRESTORE_URL = process.env.FIRESTORE_URL ?? 'firebase:8080';
export const PROJECT_ID = process.env.PROJECT_ID ?? '';
export const FIREBASE_DEFAULT_BUCKET = `${PROJECT_ID}.appspot.com`;
export const FIREBASE_APP = initializeApp({
  credential: cert({
    projectId: PROJECT_ID,
    clientEmail: process.env.ADMIN_CLIENT_EMAIL ?? '',
    // https://github.com/gladly-team/next-firebase-auth/discussions/95#discussioncomment-2433723
    privateKey: process.env.ADMIN_PRIVATE_KEY
      ? process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
      : '',
  }),
  projectId: PROJECT_ID,
  storageBucket: FIREBASE_DEFAULT_BUCKET,
});

export const SPEECH_TO_TEXT_SA_CLIENT_EMAIL =
  process.env.SPEECH_TO_TEXT_SA_CLIENT_EMAIL ?? '';
export const SPEECH_TO_TEXT_SA_PRIVATE_KEY = process.env
  .SPEECH_TO_TEXT_SA_PRIVATE_KEY
  ? process.env.SPEECH_TO_TEXT_SA_PRIVATE_KEY.replace(/\\n/g, '\n')
  : '';

export const LINE_CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN ?? '';
export const LINE_CHANNEL_SECRET = process.env.CHANNEL_SECRET ?? '';
