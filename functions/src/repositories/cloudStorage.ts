import { FIREBASE_APP } from '../config';
import { getStorage } from 'firebase-admin/storage';

const storage = getStorage(FIREBASE_APP);

export const getBucket = () => {
  return storage.bucket();
};
