import { AzureFunction, Context } from '@azure/functions';
import { Configuration, OpenAIApi } from 'openai';
import { SmsClient } from '@azure/communication-sms';

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  eventGridEvent: any
): Promise<void> {
  if (
    eventGridEvent.data.from !== process.env.MY_CELL ||
    !eventGridEvent.data.message
  )
    return;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const client = new SmsClient(process.env.COMM_SERVICE_CONN_STR);

  let message: string | undefined;

  try {
    const { data } = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: eventGridEvent.data.message,
      temperature: +process.env.OPENAI_TEMPERATURE,
      max_tokens: +process.env.OPENAI_MAX_TOKENS,
    });

    message = data.choices[0].text.trim();
  } catch (error) {
    console.log(error.message, error.stack);
    return;
  }

  try {
    await client.send({
      from: process.env.COMM_SERVICE,
      to: [process.env.MY_CELL],
      message,
    });
  } catch (error) {
    console.log(error.message, error.stack);
    return;
  }

  console.log(message);
};

export default eventGridTrigger;
