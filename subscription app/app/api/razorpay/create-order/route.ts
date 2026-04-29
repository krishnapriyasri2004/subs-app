import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { amount, currency = 'INR', receipt } = await req.json();

        // The user will provide their actual keys later in the env file
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency,
            receipt: receipt || `receipt_order_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error("Razorpay Order Creation Error: ", error);
        return NextResponse.json(
            { success: false, error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
