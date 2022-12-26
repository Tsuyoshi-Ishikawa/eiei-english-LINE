import { Client } from '@line/bot-sdk';
import { LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET } from '../config';

const client = new Client({ channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN });

export const getContent = async (messageId: string) => {
  const stream = await client.getMessageContent(messageId);
  const content: Buffer[] = [];

  for await (const chunk of stream) {
    content.push(Buffer.from(chunk));
  }

  return Buffer.concat(content);
};
