
import { useState, useEffect } from 'react';
import { getProxiedImageUrl, extractFilenameFromUrl, transformFilename } from '@/lib/imageUtils';

interface ProgressiveImageState {
  loadedUrl: string;
  isLoading: boolean;
  error: boolean;
}

export const useProgressiveImage = (url: string) => {
  const [state, setState] = useState<ProgressiveImageState>({
    loadedUrl: '',
    isLoading: true,
    error: false
  });
  
  useEffect(() => {
    if (!url) {
      setState({ loadedUrl: '', isLoading: false, error: true });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: false }));
    let isMounted = true;
    
    // Extract filename for logging
    const filename = extractFilenameFromUrl(url);
    
    // Try loading with different approaches
    const tryLoadImage = (imageUrl: string, attemptType = 'original') => {
      console.log(`Attempting to load image (${attemptType}):`, imageUrl);
      
      // Create an Image object to preload
      const img = new Image();
      
      img.onload = () => {
        if (isMounted) {
          console.log(`Image loaded successfully (${attemptType}):`, imageUrl);
          setState({ loadedUrl: imageUrl, isLoading: false, error: false });
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          if (attemptType === 'original') {
            // First attempt failed, try with transformed filename (+ -> _)
            const transformedUrl = getProxiedImageUrl(url, true);
            console.log('First attempt failed, trying transformed filename:', transformedUrl);
            tryLoadImage(transformedUrl, 'transformed');
          } 
          else if (attemptType === 'transformed') {
            // Second attempt failed, try with direct path
            const extractedFilename = extractFilenameFromUrl(url);
            const directPath = `/imagenes_descargadas/${extractedFilename}`;
            console.log('Second attempt failed, trying direct path:', directPath);
            tryLoadImage(directPath, 'direct');
          }
          else {
            // All attempts failed, use placeholder
            console.error('All image loading attempts failed:', {
              originalUrl: url,
              filename: extractFilenameFromUrl(url),
              fallbackPath: '/placeholder.svg'
            });
            setState({ 
              loadedUrl: '/placeholder.svg', 
              isLoading: false, 
              error: true 
            });
          }
        }
      };
      
      img.src = imageUrl;
    };
    
    // Get the local image URL with original filename
    const localImageUrl = getProxiedImageUrl(url, false);
    
    // Try loading the image with original filename first
    tryLoadImage(localImageUrl, 'original');
    
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
