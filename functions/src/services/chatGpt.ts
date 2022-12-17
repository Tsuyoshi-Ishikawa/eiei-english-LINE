import { openai } from '../config';

export const postChatGpt = async (prompt: string) => {
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
  console.log(text);
  return text;
};
