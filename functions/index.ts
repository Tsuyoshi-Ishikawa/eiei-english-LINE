import express from 'express';
import * as functions from 'firebase-functions';
import {
  UserStatementService,
  ChatGptAnswerService,
  AudioDataService,
} from './src/repositories';

const userStatementService = new UserStatementService();
const chatGptAnswerService = new ChatGptAnswerService();
const audioDataService = new AudioDataService();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({
    msg: 'hello world',
  });
});

export const api = functions.region('asia-northeast1').https.onRequest(app);
