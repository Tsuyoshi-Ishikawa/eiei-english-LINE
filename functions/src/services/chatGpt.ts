import { openai } from '../config';

export const postChatGpt = async (prompt: string) => {
  prompt += ' Briefly answer in 100 words or less.';
  prompt +=
    ' Please return me one question to get the discussion on this topic going.';
  const completion = await openai.createCompletion({
    model: 'text-davinci-003', // GPT3.5
    prompt: prompt,
    temperature: 0,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });

  let text = '';
  completion.data.choices.forEach((choice) => {
    text += choice.text;
  });
  console.log('ChatGptAnswer is', text);
  return text;
};
