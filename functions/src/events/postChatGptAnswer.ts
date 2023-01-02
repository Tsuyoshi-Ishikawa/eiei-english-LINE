import * as functions from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { AudioMessage } from '@line/bot-sdk';
import { ChatGptAnswer } from '../entities';
import { lineClient } from '../config';
import { AudioDataRepository } from '../repositories';

const audioDataService = new AudioDataRepository();

export const postChatGptAnswerEvent = async (
  snap: QueryDocumentSnapshot,
  context: functions.EventContext,
) => {
  const newValue = snap.data() as ChatGptAnswer;
  const { userId, audioUrl } = newValue;

  try {
    const signedUrl = await audioDataService.getSignedM4aUrl(audioUrl);
    const message = {
      type: 'audio',
      originalContentUrl: signedUrl,
      duration: 120000, // Can transmit up to 2 minutes of audio data
    } as AudioMessage;
    await lineClient.pushMessage(userId, message);
  } catch (err) {
    console.error(err);
  }
};
