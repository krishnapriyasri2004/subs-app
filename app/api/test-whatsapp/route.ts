import { NextResponse } from 'next/server';
import { sendWhatsAppNotification } from '@/lib/whatsapp';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');
  const name = searchParams.get('name') || 'Test User';

  if (!phone) {
    return NextResponse.json({ 
      error: "Phone number is required. Usage: /api/test-whatsapp?phone=919876543210" 
    }, { status: 400 });
  }

  try {
    const result = await sendWhatsAppNotification(phone, name, "This is a test message from Subtrack automated system.");
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Test message sent successfully!",
        messageId: result.messageId 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error,
        help: "Check if WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are correct in .env.local"
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
