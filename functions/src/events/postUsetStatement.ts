import { UserStatement } from '../entities';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const postUserStatementEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as UserStatement;
  const { userId, audioUrl, date } = newValue;
  console.log(audioUrl);
};
