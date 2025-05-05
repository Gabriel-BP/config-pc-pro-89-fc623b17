
/**
 * Utility for handling image URLs and proxying them to avoid CORS issues
 */

// Updated CORS proxy list with more reliable services
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere-jbdc.onrender.com/',
  'https://cors-proxy.htmldriven.com/?url='
];

let proxyIndex = 0;

// Obtiene el siguiente proxy en la rotación
const getNextProxy = (): string => {
  const proxy = CORS_PROXIES[proxyIndex];
  proxyIndex = (proxyIndex + 1) % CORS_PROXIES.length;
  return proxy;
};

// Function to extract the filename from a URL
const extractFilenameFromUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // Extract the filename from the URL path
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
};

// Use local images from imagenes_descargadas folder or fallback to CORS proxy
export const getProxiedImageUrl = (url: string): string => {
  // Make sure the URL is valid
  if (!url || typeof url !== 'string') {
    return '';
  }

  // If it's a relative URL or data URL, return as is
  if (url.startsWith('/') || url.startsWith('data:')) {
    return url;
  }
  
  // Extract the filename from the URL and use the local version
  const filename = extractFilenameFromUrl(url);
  if (filename) {
    return `/imagenes_descargadas/${filename}`;
  }
  
  // If we couldn't extract a filename, fall back to the original URL
  return url;
};
