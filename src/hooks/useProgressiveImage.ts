
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
    
    // Try loading with original filename
    const tryLoadImage = (imageUrl: string, attemptWithTransformedFilename = false) => {
      // Create an Image object to preload
      const img = new Image();
      
      img.onload = () => {
        if (isMounted) {
          setState({ loadedUrl: imageUrl, isLoading: false, error: false });
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          if (!attemptWithTransformedFilename) {
            // First attempt failed, try with transformed filename (+ -> _)
            const transformedUrl = getProxiedImageUrl(url, true);
            console.log('First attempt failed, trying transformed filename:', {
              originalUrl: url,
              transformedUrl
            });
            tryLoadImage(transformedUrl, true);
          } else {
            // Both attempts failed, use placeholder
            console.error('All image loading attempts failed:', {
              originalUrl: url,
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
    
    console.log('Attempting to load image:', {
      originalUrl: url,
      extractedFilename: extractFilenameFromUrl(url),
      localPath: localImageUrl
    });
    
    // Try loading the image with original filename first
    tryLoadImage(localImageUrl);
    
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
