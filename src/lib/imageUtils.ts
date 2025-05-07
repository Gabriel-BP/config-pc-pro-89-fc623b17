
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
    const matches = url.match(/\/([^\/]+)$/i);
    return matches ? matches[1] : '';
  }
};

// Transform filename by replacing "+" with "_" for better compatibility
export const transformFilename = (filename: string): string => {
  return filename.replace(/\+/g, '_');
};

// Simple function to get the local path to an image
export const getImagePath = (filename: string): string => {
  if (!filename) return '/placeholder.svg';
  return `/imagenes_descargadas/${filename}`;
};
