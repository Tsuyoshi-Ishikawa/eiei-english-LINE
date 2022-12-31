import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { UserStatement } from '../entities';
import { transcriptSpeech, postChatGpt, transcriptText } from '../services';
import { ChatGptAnswerRepository } from '../repositories';

const chatGptAnswer = new ChatGptAnswerRepository();

export const postUserStatementEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as UserStatement;
  const { userId, audioUrl, date } = newValue;

  try {
    const userStatementText = await transcriptSpeech(audioUrl);
    const chatGptStatementText = await postChatGpt(userStatementText);
    const chatGptStatementUrl = await transcriptText(
      userId,
      chatGptStatementText,
    );
    await chatGptAnswer.setAnswer({
      userId,
      audioUrl: chatGptStatementUrl,
      userStatementText,
      chatGptStatementText,
    });
  } catch (err) {
    console.error(err);
  }
};
