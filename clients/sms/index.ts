import { SmsClient } from '@azure/communication-sms';

const smsClient = new SmsClient(process.env.COMM_SERVICE_CONN_STR);

const sms = (message: string) =>
  smsClient.send({
    from: process.env.COMM_SERVICE,
    to: [process.env.MY_CELL],
    message: message.trim(),
  });

export default sms;
