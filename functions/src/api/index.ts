import { UserStatementRepository, AudioDataRepository } from '../repositories';

const userStatement = new UserStatementRepository();
const audioData = new AudioDataRepository();

export const post = async () => {
  await audioData.uploadWAV();
  const filename = 'introduce';
  await userStatement.setStatement({
    userId: 'TsuyoshiIshikawa',
    audioUrl: filename,
  });
};
