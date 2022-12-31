import { deepgram } from '../config';

export const transcriptSpeech = async (content: Buffer) => {
  const preRecord = {
    buffer: content,
    mimetype: 'audio/mp4',
  };
  const response = await deepgram.transcription.preRecorded(preRecord);

  if (!response.results) throw new Error('Your audio data is not valid');

  const transcriptionArray: Array<string> = [];
  response.results?.channels.forEach((channel) => {
    channel.alternatives.forEach((alternative) => {
      transcriptionArray.push(alternative.transcript);
    });
  });

  const userStatement = transcriptionArray.join(' ');
  console.log(`userStatement: ${userStatement}`);
  return userStatement;
};
