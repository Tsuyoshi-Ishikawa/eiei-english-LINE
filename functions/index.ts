import express from 'express';
import * as functions from 'firebase-functions';
import { chatGptAnswerCollection, userStatementCollection } from './src/consts';
import { post } from './src/api';
import { postUserStatementEvent, postChatGptAnswerEvent } from './src/events';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', (req, res) => {
  post();
  res.status(200).send({
    msg: 'hello world',
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
