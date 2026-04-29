/**
 * Twilio Utility for sending SMS
 */
import twilio from 'twilio';

// Initialize the Twilio client
// You need to set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env.local
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '';

let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

import { formatTwilioNumber } from './twilio-client';

export async function sendTwilioSms(to: string, message: string) {
  if (!client || !twilioPhoneNumber) {
    console.warn("Twilio credentials missing. Would have sent SMS to:", to, "Message:", message);
    return { success: false, error: "Configuration missing" };
  }

  const cleanPhone = formatTwilioNumber(to);

  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: cleanPhone,
    });

    return { success: true, messageId: response.sid };
  } catch (error: any) {
    console.error("Twilio API Error:", error);
    return { success: false, error: error.message || "Network error" };
  }
}
