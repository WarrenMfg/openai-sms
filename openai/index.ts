import { AzureFunction, Context } from '@azure/functions';
import openai from '../src/openai';
import sms from '../src/sms';

const eventGridTrigger: AzureFunction = async function (
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventGridEvent: any
): Promise<void> {
  if (
    eventGridEvent.data.from !== process.env.MY_CELL ||
    !eventGridEvent.data.message
  )
    return;

  let message: string | undefined;

  try {
    const { data } = await openai(eventGridEvent.data.message);
    message = data.choices[0].text.trim();
  } catch (error) {
    console.log(error.message, error.stack);
    return;
  }

  try {
    await sms(message);
  } catch (error) {
    console.log(error.message, error.stack);
    return;
  }
};

export default eventGridTrigger;
