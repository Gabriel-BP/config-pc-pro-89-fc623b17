
/**
 * Utility for handling image URLs and proxying them to avoid CORS issues
 */

// Lista de proxies CORS alternativos para usar en rotación
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere-jbdc.onrender.com/'
];

let proxyIndex = 0;

// Obtiene el siguiente proxy en la rotación
const getNextProxy = (): string => {
  const proxy = CORS_PROXIES[proxyIndex];
  proxyIndex = (proxyIndex + 1) % CORS_PROXIES.length;
  return proxy;
};

// Use a CORS proxy to bypass the CORS restrictions
export const getProxiedImageUrl = (url: string): string => {
  // Make sure the URL is valid
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Si es una URL relativa o ya tiene un proxy, devuélvela tal cual
  if (url.startsWith('/') || url.startsWith('data:') || 
      CORS_PROXIES.some(proxy => url.includes(proxy))) {
    return url;
  }
  
  // Usar el proxy actual para la URL
  const proxy = getNextProxy();
  
  // Para Amazon y otras URLs que suelen causar problemas CORS
  if (url.includes('amazon') || url.includes('amzn') || url.includes('http')) {
    return `${proxy}${encodeURIComponent(url)}`;
  }

  return url;
};
