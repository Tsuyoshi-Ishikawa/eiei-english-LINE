import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { AudioMessage } from '@line/bot-sdk';
import { UserStatement } from '../entities';
import { postChatGpt, transcriptText } from '../services';
import { AudioDataRepository, ChatGptAnswerRepository } from '../repositories';
import { lineClient } from '../config';
import { getFileName } from '../utils';

const chatGptAnswer = new ChatGptAnswerRepository();
const audioDataService = new AudioDataRepository();

export const postUserStatementEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as UserStatement;
  const { userId, comment, date } = newValue;

  try {
    const chatGptStatementText = await postChatGpt(comment);
    const mp3Buffer = await transcriptText(userId, chatGptStatementText);

    // line bot can only handle only m4a.
    // After upload mp3, convert mp3 to m4a.
    // https://developers.line.biz/en/reference/messaging-api/#audio-message
    const transcriptMp3Url = getFileName({
      prefix: 'answer',
      userId,
      extension: 'mp3',
    });
    await audioDataService.uploadMP3(transcriptMp3Url, mp3Buffer);

    const transcriptM4aFileName = getFileName({
      prefix: 'answer',
      userId,
      extension: 'm4a',
    });

    await audioDataService.uploadM4aFromMP3File(
      transcriptM4aFileName,
      transcriptMp3Url,
    );

    await chatGptAnswer.setAnswer({
      userId,
      audioUrl: transcriptM4aFileName,
      userStatementText: comment,
      chatGptStatementText,
    });

    const message = {
      type: 'audio',
      originalContentUrl: '', // todo set URL
      duration: 120000, // Can transmit up to 2 minutes of audio data
    } as AudioMessage;
    await lineClient.pushMessage(userId, message);
  } catch (err) {
    console.error(err);
  }
};
