import { FIREBASE_APP, FIRESTORE_URL, IS_DEV } from '../config';
import {
  getFirestore,
  DocumentData,
  CollectionReference,
} from 'firebase-admin/firestore';

export const firestore = getFirestore(FIREBASE_APP);

if (IS_DEV) {
  firestore.settings({
    host: FIRESTORE_URL,
    ssl: IS_DEV ? false : true,
  });
}

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return firestore.collection(collectionName) as CollectionReference<T>;
};
