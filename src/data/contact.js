export const CONTACT_PENDING = 'O atendimento comercial ainda está em configuração.';
export const WHATSAPP_INITIAL_MESSAGE = 'Olá! Conheci o Ateliê Digital e gostaria de conversar sobre um projeto.';

export function quoteHref(email, service = '') {
  const address = typeof email === 'string' ? email.trim() : '';
  const parts = address.toLowerCase().split('@');
  if (address.length > 254 || parts[0].length > 64 ||
      !/^[a-z0-9_+.-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(address) ||
      /(?:^\.|\.@|\.\.)/.test(address) ||
      /(?:^|\.)(?:exemplo|example)\.(?:com|org|net)(?:\.br)?$/.test(parts[1]) ||
      /\.(?:example|invalid|test|localhost)$/.test(parts[1]) ||
      parts[1].split('.').some(label => label.length > 63 || label.startsWith('-') || label.endsWith('-'))) return '';

  const subject = 'Solicitação de orçamento';
  const body = `Olá, Ateliê Digital!\r\n\r\nTipo de projeto: ${service}\r\nObjetivo:\r\nPrazo previsto:\r\n`;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function whatsappHref(phone, message = WHATSAPP_INITIAL_MESSAGE) {
  const digits = typeof phone === 'string' ? phone.replace(/\D/g, '') : '';
  if (!/^\d{11,15}$/.test(digits)) return '';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
