import { lineClient } from '../config';

export const getContent = async (messageId: string) => {
  const stream = await lineClient.getMessageContent(messageId);
  const content: Buffer[] = [];

  for await (const chunk of stream) {
    content.push(Buffer.from(chunk));
  }

  return Buffer.concat(content);
};
