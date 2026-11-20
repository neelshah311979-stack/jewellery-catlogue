export const ATELIER_WHATSAPP_E164 = '919136689009';
export const ATELIER_WHATSAPP_DISPLAY = '+91 91366 89009';
export const ATELIER_TEL_URL = 'tel:+919136689009';

export function buildWhatsAppUrl(message?: string): string {
  const baseUrl = `https://wa.me/${ATELIER_WHATSAPP_E164}`;
  if (!message || !message.trim()) {
    return baseUrl;
  }
  return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
}
