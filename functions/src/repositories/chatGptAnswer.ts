import { CollectionReference } from 'firebase-admin/firestore';
import { createCollection } from '../repositories';
import { ChatGptAnswer } from '../entities';
import { chatGptAnswerCollection } from '../consts';

export class ChatGptAnswerRepository {
  collection: CollectionReference<ChatGptAnswer>;

  constructor() {
    this.collection = createCollection<ChatGptAnswer>(chatGptAnswerCollection);
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
