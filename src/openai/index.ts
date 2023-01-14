import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openaiClient = new OpenAIApi(configuration);

const openai = (prompt: string) =>
  openaiClient.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: +process.env.OPENAI_TEMPERATURE,
    max_tokens: +process.env.OPENAI_MAX_TOKENS,
  });

export default openai;
