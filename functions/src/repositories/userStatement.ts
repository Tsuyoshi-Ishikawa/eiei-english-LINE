import { CollectionReference } from 'firebase-admin/firestore';
import { createCollection } from '../repositories';
import { UserStatement } from '../entities';

export class UserStatementService {
  collection: CollectionReference<UserStatement>;

  constructor() {
    this.collection = createCollection<UserStatement>('user_statements');
  }

  async setStatement(data: Pick<UserStatement, 'userId' | 'audioUrl'>) {
    const statement = {
      ...data,
      date: new Date(),
    };
    await this.collection.add(statement);
  }
}
