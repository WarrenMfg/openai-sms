import { AzureFunction } from '@azure/functions';
import openai from '../src/openai';
import sms from '../src/sms';

// context: Context,
// myTimer: any

const timerTrigger: AzureFunction = async function (): Promise<void> {
  let message: string | undefined;

  try {
    const { data } = await openai(process.env.OPENAI_DAILY_PROMPT);
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

export default timerTrigger;
