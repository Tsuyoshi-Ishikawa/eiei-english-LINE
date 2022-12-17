import { ChatGptAnswer } from '../entities';
import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const postChatGptAnswerEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as ChatGptAnswer;
  const { userId, audioUrl, userStatementText, chatGptStatementText, date } =
    newValue;
  console.log(audioUrl);
};
