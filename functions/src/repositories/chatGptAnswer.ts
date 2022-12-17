import { CollectionReference } from 'firebase-admin/firestore';
import { createCollection } from '../repositories';
import { ChatGptAnswer } from '../entities';

export class ChatGptAnswerService {
  collection: CollectionReference<ChatGptAnswer>;

  constructor() {
    this.collection = createCollection<ChatGptAnswer>('chatGpt_answers');
  }

  async setAnswer(
    data: Pick<
      ChatGptAnswer,
      'userId' | 'audioUrl' | 'userStatementText' | 'chatGptStatementText'
    >,
  ) {
    const answer = {
      ...data,
      date: new Date(),
    };
    await this.collection.add(answer);
  }
}
