import { UserStatementRepository, AudioDataRepository } from '../repositories';
import { getContent } from '../services/line';
import { getFileName } from '../utils/file';

const userStatement = new UserStatementRepository();
const audioData = new AudioDataRepository();

export const post = async (params: { userId: string; messageId: string }) => {
  const { userId, messageId } = params;

  const filename = getFileName({
    prefix: 'question',
    userId,
    extension: 'wav',
  });
  const content = await getContent(messageId);

  await audioData.uploadWAV(filename, content);
  await userStatement.setStatement({
    userId,
    audioUrl: filename,
  });
};
