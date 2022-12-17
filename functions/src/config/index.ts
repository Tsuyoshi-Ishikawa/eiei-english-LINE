import { initializeApp, applicationDefault } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

export const IS_DEV = process.env.IS_DEV ?? true;

export const FIRESTORE_URL = process.env.FIRESTORE_URL ?? 'firebase:8080';
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ?? '';
export const FIREBASE_SECRET_PATH = process.env.FIREBASE_SECRET_PATH ?? '';
export const FIREBASE_APP = initializeApp({
  credential: applicationDefault(),
  projectId: FIREBASE_PROJECT_ID,
});
