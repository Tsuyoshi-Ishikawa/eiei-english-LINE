import { CollectionReference } from 'firebase-admin/firestore';
import { createCollection } from '../repositories';
import { UserStatement } from '../entities';
import { userStatementCollection } from '../consts';

export class UserStatementService {
  collection: CollectionReference<UserStatement>;

  constructor() {
    this.collection = createCollection<UserStatement>(userStatementCollection);
  }

  async setStatement(data: Pick<UserStatement, 'userId' | 'audioUrl'>) {
    const statement = {
      ...data,
      date: new Date(),
    };
    await this.collection.add(statement);
  }
}
