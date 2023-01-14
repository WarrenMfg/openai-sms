import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openaiClient = new OpenAIApi(configuration);

const openai = (prompt: string) =>
  openaiClient.createCompletion({
    model: process.env.OPENAI_MODEL,
    prompt: prompt.trim(),
    temperature: +process.env.OPENAI_TEMPERATURE,
    max_tokens: +process.env.OPENAI_MAX_TOKENS,
  });

export default openai;
