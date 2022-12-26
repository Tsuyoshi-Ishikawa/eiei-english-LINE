import express from 'express';
import * as functions from 'firebase-functions';
import { validateSignature, WebhookRequestBody } from '@line/bot-sdk';
import { chatGptAnswerCollection, userStatementCollection } from './src/consts';
import { post } from './src/api';
import { postUserStatementEvent, postChatGptAnswerEvent } from './src/events';
import { isMessageEvent, isAudioEventMessage } from './src/services';
import { LINE_CHANNEL_SECRET } from './src/config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  try {
    // const signature = typeof req.headers['x-line-signature'] === 'string' ? req.headers['x-line-signature'] : '';
    // if (!validateSignature(req.body, LINE_CHANNEL_SECRET, signature))
    //   throw new Error('LINEから音声データを送信してください。');

    const body = req.body as WebhookRequestBody;
    body.events.forEach((event) => {
      if (
        isMessageEvent(event) &&
        isAudioEventMessage(event.message) &&
        event.source.userId
      ) {
        post({
          userId: event.source.userId,
          messageId: event.message.id,
        });
      } else {
        throw new Error('英語で音声データを送ってください。');
      }
    });
    // post({
    //   userId: 'Tsuyoshi',
    //   messageId: 'messageId'
    // })
    res.status(200).send({
      msg: 'hello world',
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    res.status(200).send({
      msg: 'error',
    });
  }
});

export const api = functions.region('asia-northeast1').https.onRequest(app);

export const postUserStatement = functions
  .region('asia-northeast1')
  .firestore.document(`${userStatementCollection}/{Id}`)
  .onCreate(postUserStatementEvent);

export const postChatGptAnswer = functions
  .region('asia-northeast1')
  .firestore.document(`${chatGptAnswerCollection}/{Id}`)
  .onCreate(postChatGptAnswerEvent);
