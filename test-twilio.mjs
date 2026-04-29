import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
    console.error("Missing credentials in .env.local");
    process.exit(1);
}

const client = twilio(accountSid, authToken);

async function test() {
    try {
        console.log(`Attempting to send message from ${twilioPhoneNumber}...`);
        
        // Let's check the account balance or just try to send a message
        // Actually, without knowing the user's personal verified phone number, we can't send a test SMS safely.
        // Let's just fetch the account details to verify the auth token is correct.
        const account = await client.api.accounts(accountSid).fetch();
        console.log("Account successfully fetched:", account.friendlyName);
        console.log("Status:", account.status);
        console.log("Type:", account.type);
        
        // Check available phone numbers
        const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({limit: 5});
        console.log("Phone numbers associated with account:");
        incomingPhoneNumbers.forEach(number => {
            console.log(number.phoneNumber);
        });

    } catch (error) {
        console.error("Twilio API Error:");
        console.error(error);
    }
}

test();
