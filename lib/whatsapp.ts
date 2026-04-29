/**
 * WhatsApp Utility
 * Supports both Meta Cloud API (Automated) and wa.me URL Scheme (Client-side redirection)
 */



/**
 * Formats a phone number for WhatsApp:
 * 1. Removes all non-digit characters
 * 2. Adds country code (defaults to 91 for India if 10 digits)
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return '';

  // Clean phone number (remove +, spaces, -, etc.)
  let cleanPhone = phone.toString().replace(/\D/g, '');

  // If it's 10 digits, assume India and add 91
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  return cleanPhone;
}

/**
 * Fetches the best possible WhatsApp number from a user/customer profile
 */
export function getWhatsAppNumberFromProfile(profile: any): string {
  if (!profile) return '';
  return profile.whatsapp || profile.mobile || profile.phone || '';
}

/**
 * Generates a wa.me URL for client-side redirection
 * Used for "Click to Chat" functionality
 */
export function getWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Opens WhatsApp in a new tab with a pre-filled message
 */
export function openWhatsApp(phone: string, message: string) {
  if (typeof window !== 'undefined') {
    const url = getWhatsAppUrl(phone, message);
    window.open(url, '_blank');
  }
}

/**
 * Helper to open WhatsApp using a profile object
 */
export function openWhatsAppForProfile(profile: any, message: string) {
  const phone = getWhatsAppNumberFromProfile(profile);
  if (phone) {
    openWhatsApp(phone, message);
  } else {
    console.warn("No phone number found in profile", profile);
  }
}

/**
 * Server-side / Automated WhatsApp Notification using Meta Cloud API
 * To use this, you need:
 * 1. Meta Developer App
 * 2. WhatsApp Business Account
 * 3. Access Token & Phone Number ID in .env.local
 */
export async function sendWhatsAppNotification(to: string, userName: string, message?: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    // Fallback to console log if not configured
    console.warn("WhatsApp credentials missing. Would have sent message to:", to);
    return { success: false, error: "Configuration missing" };
  }

  const cleanPhone = formatWhatsAppNumber(to);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          type: message ? 'text' : 'template',
          ...(message ? {
            text: { body: message }
          } : {
            template: {
              name: 'welcome_customer',
              language: { code: 'en_US' },
              components: [
                {
                  type: 'body',
                  parameters: [
                    { type: 'text', text: userName }
                  ]
                }
              ]
            }
          })
        }),
      }
    );

    const data = await response.json();

    if (data.messages) {
      return { success: true, messageId: data.messages[0].id };
    } else {
      console.error("WhatsApp API Error:", data.error?.message || "Unknown error");
      return { success: false, error: data.error?.message };
    }
  } catch (error) {
    console.error("WhatsApp Network Error:", error);
    return { success: false, error: "Network error" };
  }
}


