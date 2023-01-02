import express from 'express';
import * as functions from 'firebase-functions';
import {
  TextMessage,
  validateSignature,
  WebhookRequestBody,
} from '@line/bot-sdk';
import { chatGptAnswerCollection, userStatementCollection } from './src/consts';
import { post } from './src/api';
import { postChatGptAnswerEvent, postUserStatementEvent } from './src/events';
import { isMessageEvent, isAudioEventMessage } from './src/services';
import { LINE_CHANNEL_SECRET, lineClient } from './src/config';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  const body = req.body as WebhookRequestBody;
  let replyToken = '';
  try {
    // const signature = typeof req.headers['x-line-signature'] === 'string' ? req.headers['x-line-signature'] : '';
    // if (!validateSignature(req.body, LINE_CHANNEL_SECRET, signature))
    //   throw new Error('LINEから音声データを送信してください。');

    body.events.forEach((event) => {
      if (
        isMessageEvent(event) &&
        isAudioEventMessage(event.message) &&
        event.source.userId
      ) {
        replyToken = event.replyToken;
        post({
          userId: event.source.userId,
          messageId: event.message.id,
        });
      } else {
        throw new Error('英語で音声データを送ってください。');
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      const message = {
        type: 'text',
        text: err.message,
      } as TextMessage;
      lineClient.replyMessage(replyToken, message);
    }
  }
  res.status(200).send({
    body: 'OK',
  });
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
