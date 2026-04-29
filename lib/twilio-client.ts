export function formatTwilioNumber(phone: string): string {
  if (!phone) return '';
  let cleanPhone = phone.toString().replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '+91' + cleanPhone; // Default to India
  } else if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
  }
  return cleanPhone;
}

export function getSmsNumberFromProfile(profile: any): string {
  if (!profile) return '';
  return profile.mobile || profile.phone || profile.whatsapp || '';
}

/**
 * Fallback to standard SMS protocol for client side opening of SMS app
 */
export function openSmsApp(phone: string, message: string) {
  if (typeof window !== 'undefined') {
    const cleanPhone = formatTwilioNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    const url = `sms:${cleanPhone}?body=${encodedMessage}`;
    window.open(url, '_self');
  }
}

export function openSmsForProfile(profile: any, message: string) {
  const phone = getSmsNumberFromProfile(profile);
  if (phone) {
    openSmsApp(phone, message);
  } else {
    console.warn("No phone number found in profile", profile);
  }
}
