import { UserStatementRepository } from '../repositories';
import { getContent } from '../services/line';
import { transcriptSpeech } from '../services';

const userStatement = new UserStatementRepository();

export const post = async (params: { userId: string; messageId: string }) => {
  const { userId, messageId } = params;

  const content = await getContent(messageId);
  const userComment = await transcriptSpeech(content);

  await userStatement.setStatement({
    userId,
    comment: userComment,
  });
};
