import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!client || !verifyServiceSid) {
      return NextResponse.json({ error: 'Twilio is not configured properly in .env.local (missing Account SID, Auth Token, or Verify Service SID)' }, { status: 500 });
    }

    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phone, channel: 'sms' });

    console.log(`Sending Twilio Verify SMS to ${phone}. Status: ${verification.status}`);

    return NextResponse.json({ success: true, status: verification.status });
  } catch (error: any) {
    console.error('Error sending OTP via Twilio Verify:', error);
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
