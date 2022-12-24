import { UserStatementService, AudioDataService } from '../repositories';

const userStatementService = new UserStatementService();
const audioDataService = new AudioDataService();

export const post = async () => {
  await audioDataService.uploadWAV();
  const filename = 'introduce';
  await userStatementService.setStatement({
    userId: 'TsuyoshiIshikawa',
    audioUrl: filename,
  });
};
