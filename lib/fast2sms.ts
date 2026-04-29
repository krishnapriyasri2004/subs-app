export async function sendFast2SMS(phoneNumber: string, message: string) {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.error("Fast2SMS API Key is missing in environment variables");
    return { success: false, error: "Configuration error" };
  }

  // Fast2SMS expects 10 digit numbers for India
  const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "route": "q",
        "message": message,
        "language": "english",
        "flash": 0,
        "numbers": cleanPhone,
      }),
    });

    const data = await response.json();
    
    if (data.return === true) {
      console.log(`SMS sent successfully to ${cleanPhone}: ${data.request_id}`);
      return { success: true, request_id: data.request_id };
    } else {
      console.error("Fast2SMS API Error:", data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error("Fast2SMS Network Error:", error);
    return { success: false, error: "Network error" };
  }
}
