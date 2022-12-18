import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { UserStatement } from '../entities';
import { transcript } from '../services/speakToText';

export const postUserStatementEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as UserStatement;
  const { userId, audioUrl, date } = newValue;

  transcript('introduce');
};
