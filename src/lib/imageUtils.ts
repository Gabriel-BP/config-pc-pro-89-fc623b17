
/**
 * Utility for handling image URLs and proxying them to avoid CORS issues
 */

// Extract the filename from a URL (particularly from Amazon URLs)
export const extractFilenameFromUrl = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  try {
    // Extract filename from the URL
    // For Amazon URLs like "https://m.media-amazon.com/images/I/51zWG6NZB-L._SL500_.jpg"
    // We want to extract "51zWG6NZB-L._SL500_.jpg"
    const urlObj = new URL(url);
    const pathnameParts = urlObj.pathname.split('/');
    // Get the last part of the path which should be the filename
    return pathnameParts[pathnameParts.length - 1];
  } catch (e) {
    // If there's an error parsing the URL, try to extract using regex as fallback
    const matches = url.match(/\/([^\/]+\.(jpg|jpeg|png|gif|webp|svg))(\?.*)?$/i);
    return matches ? matches[1] : '';
  }
};

// Get the local image path from the downloaded images folder
export const getProxiedImageUrl = (url: string): string => {
  // Make sure the URL is valid
  if (!url || typeof url !== 'string') {
    return '/placeholder.svg';
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
  
  // If we couldn't extract a filename, return a placeholder
  return '/placeholder.svg';
};
