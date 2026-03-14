export interface SMS {
  id: string;
  from: string;
  text: string;
  timestamp: number;
}

export interface PhoneNumber {
  id: string;
  number: string;
  country: string;
  countryCode: string;
  smsCount: number;
  expiresAt: number;
  messages?: SMS[];
}

export type Language = 'en' | 'es';

export const TRANSLATIONS = {
  en: {
    title: 'Receive SMS Online Free',
    subtitle: 'Temporary phone numbers for verification',
    disclaimer: 'These are PUBLIC shared numbers. Do NOT use for important accounts, banking, 2FA, or privacy-sensitive services. We are not responsible for any misuse or data exposure.',
    copy: 'Copy Number',
    copied: 'Copied!',
    refresh: 'Refresh SMS',
    getNew: 'Get New Number',
    activeNumbers: 'Active Numbers',
    messages: 'Messages',
    from: 'From',
    content: 'Content',
    time: 'Time',
    noMessages: 'Waiting for new messages...',
    expiresIn: 'Expires in',
    premium: 'Premium Numbers',
    premiumDesc: 'Private numbers with no ads. Coming soon.',
    adSupport: 'This free service is supported by advertisements. Ads allow us to provide numbers 24/7 at no cost to you.',
    allCountries: 'All Countries',
  },
  es: {
    title: 'Recibir SMS Online Gratis',
    subtitle: 'Números de teléfono temporales para verificación',
    disclaimer: 'Estos son números públicos compartidos. NO los use para cuentas importantes, banca, 2FA o servicios sensibles a la privacidad. No somos responsables de ningún mal uso o exposición de datos.',
    copy: 'Copiar Número',
    copied: '¡Copiado!',
    refresh: 'Actualizar SMS',
    getNew: 'Obtener Nuevo Número',
    activeNumbers: 'Números Activos',
    messages: 'Mensajes',
    from: 'De',
    content: 'Contenido',
    time: 'Hora',
    noMessages: 'Esperando nuevos mensajes...',
    expiresIn: 'Expira en',
    premium: 'Números Premium',
    premiumDesc: 'Números privados sin anuncios. Próximamente.',
    adSupport: 'Este servicio gratuito se financia con publicidad. Los anuncios nos permiten ofrecer números 24/7 sin coste para usted.',
    allCountries: 'Todos los países',
  }
};
