import { NextResponse } from 'next/server';
import { sendFast2SMS } from '@/lib/fast2sms';

export async function POST(req: Request) {
  try {
    const { phoneNumber, message } = await req.json();

    if (!phoneNumber || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 });
    }

    const result = await sendFast2SMS(phoneNumber, message);

    if (result.success) {
      return NextResponse.json({ success: true, request_id: result.request_id });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
