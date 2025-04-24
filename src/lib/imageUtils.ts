
/**
 * Utility for handling image URLs and proxying them to avoid CORS issues
 */

// Use a CORS proxy to bypass the ORB restrictions
export const getProxiedImageUrl = (url: string): string => {
  // Make sure the URL is valid
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // If it's already using HTTPS or a relative URL, we need a proxy for Amazon URLs
  if (url.includes('amazon') || url.includes('amzn')) {
    // Use a CORS proxy (corsproxy.io is a common one)
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
  }

  return url;
};
