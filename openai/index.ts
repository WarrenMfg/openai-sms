import { AzureFunction, Context } from '@azure/functions';
import { Configuration, OpenAIApi } from 'openai';
import { SmsClient } from '@azure/communication-sms';

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: any
): Promise<void> {
  if (eventGridEvent.data.from !== process.env.MY_CELL) return;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const client = new SmsClient(process.env.COMM_SERVICE_CONN_STR);

  try {
    const { data } = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: eventGridEvent.data.message,
      temperature: +process.env.OPENAI_TEMPERATURE,
      max_tokens: +process.env.MAX_TOKENS,
    });

    await client.send({
      from: process.env.COMM_SERVICE,
      to: [process.env.MY_CELL],
      message: data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
  }
};

export default eventGridTrigger;
