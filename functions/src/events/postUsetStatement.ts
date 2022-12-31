import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { UserStatement } from '../entities';
import { postChatGpt, transcriptText } from '../services';
import { ChatGptAnswerRepository } from '../repositories';

const chatGptAnswer = new ChatGptAnswerRepository();

export const postUserStatementEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as UserStatement;
  const { userId, comment, date } = newValue;

  try {
    const chatGptStatementText = await postChatGpt(comment);
    const chatGptStatementUrl = await transcriptText(
      userId,
      chatGptStatementText,
    );
    await chatGptAnswer.setAnswer({
      userId,
      audioUrl: chatGptStatementUrl,
      userStatementText: comment,
      chatGptStatementText,
    });
  } catch (err) {
    console.error(err);
  }
};
