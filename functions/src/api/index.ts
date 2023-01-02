import { AudioMessage } from '@line/bot-sdk';
import { AudioDataRepository, ChatGptAnswerRepository } from '../repositories';
import { getContent } from '../services/line';
import { postChatGpt, transcriptSpeech, transcriptText } from '../services';
import { getFileName } from '../utils';
import { lineClient } from '../config';

const chatGptAnswer = new ChatGptAnswerRepository();
const audioDataService = new AudioDataRepository();

export const post = async (params: { userId: string; messageId: string }) => {
  const { userId, messageId } = params;

  const content = await getContent(messageId);
  const userComment = await transcriptSpeech(content);
  const chatGptStatementText = await postChatGpt(userComment);
  const mp3Buffer = await transcriptText(userId, chatGptStatementText);

  // line bot can only handle only m4a.
  // After upload mp3, convert mp3 to m4a.
  // https://developers.line.biz/en/reference/messaging-api/#audio-message
  const transcriptMp3Url = getFileName({
    prefix: 'answer',
    userId,
    extension: 'mp3',
  });
  await audioDataService.uploadMP3(transcriptMp3Url, mp3Buffer);

  const transcriptM4aFileName = getFileName({
    prefix: 'answer',
    userId,
    extension: 'm4a',
  });

  await audioDataService.uploadM4aFromMP3File(
    transcriptM4aFileName,
    transcriptMp3Url,
  );

  const signedUrl = await audioDataService.getSignedM4aUrl(
    transcriptM4aFileName,
  );
  const message = {
    type: 'audio',
    originalContentUrl: signedUrl,
    duration: 120000, // Can transmit up to 2 minutes of audio data
  } as AudioMessage;
  await lineClient.pushMessage(userId, message);

  await chatGptAnswer.setAnswer({
    userId,
    audioUrl: transcriptM4aFileName,
    userStatementText: userComment,
    chatGptStatementText,
  });
};
