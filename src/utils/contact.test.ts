import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ATELIER_WHATSAPP_E164,
  ATELIER_WHATSAPP_DISPLAY,
  ATELIER_TEL_URL,
  buildWhatsAppUrl,
} from './contact';

test('WhatsApp constants use the connected Mumbai atelier number 9136689009', () => {
  assert.equal(ATELIER_WHATSAPP_E164, '919136689009');
  assert.equal(ATELIER_WHATSAPP_DISPLAY, '+91 91366 89009');
  assert.equal(ATELIER_TEL_URL, 'tel:+919136689009');
});

test('buildWhatsAppUrl returns clean base wa.me URL when message is empty', () => {
  assert.equal(buildWhatsAppUrl(), 'https://wa.me/919136689009');
  assert.equal(buildWhatsAppUrl('   '), 'https://wa.me/919136689009');
});

test('buildWhatsAppUrl URI-encodes bespoke jewelry inquiry messages safely', () => {
  const url = buildWhatsAppUrl('Hello One Soul Jewellery — 2.5 CT Royal Oval (18K Yellow Gold)');
  assert.ok(url.startsWith('https://wa.me/919136689009?text='));
  const parsed = new URL(url);
  assert.equal(
    parsed.searchParams.get('text'),
    'Hello One Soul Jewellery — 2.5 CT Royal Oval (18K Yellow Gold)'
  );
});
