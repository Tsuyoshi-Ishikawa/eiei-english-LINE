import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export const IS_DEV = process.env.IS_DEV ?? true;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);

export const FIRESTORE_URL = process.env.FIRESTORE_URL ?? 'firebase:8080';
export const PROJECT_ID = process.env.PROJECT_ID ?? '';
export const FIREBASE_DEFAULT_BUCKET = `${PROJECT_ID}.appspot.com`;
export const FIREBASE_APP = initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
  storageBucket: FIREBASE_DEFAULT_BUCKET,
});
