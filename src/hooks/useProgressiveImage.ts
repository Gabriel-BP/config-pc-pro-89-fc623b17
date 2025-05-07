
import { useState, useEffect } from 'react';
import { extractFilenameFromUrl, transformFilename } from '@/lib/imageUtils';

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
    
    // Extract filename from URL - this is the only thing we'll use
    const extractedFilename = extractFilenameFromUrl(url);
    
    if (!extractedFilename) {
      console.error('Could not extract filename from URL:', url);
      setState({ loadedUrl: '/placeholder.svg', isLoading: false, error: true });
      return;
    }
    
    console.log(`Extracted filename: ${extractedFilename}`);
    
    // Try loading with different approaches
    const tryLoadImage = (filename: string, attemptType = 'original') => {
      const imagePath = `/imagenes_descargadas/${filename}`;
      console.log(`Attempting to load image (${attemptType}):`, imagePath);
      
      // Create an Image object to preload
      const img = new Image();
      
      img.onload = () => {
        if (isMounted) {
          console.log(`Image loaded successfully (${attemptType}):`, imagePath);
          setState({ loadedUrl: imagePath, isLoading: false, error: false });
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          if (attemptType === 'original') {
            // First attempt failed, try with transformed filename (+ -> _)
            const transformedFilename = transformFilename(extractedFilename);
            console.log('First attempt failed, trying transformed filename:', transformedFilename);
            tryLoadImage(transformedFilename, 'transformed');
          } 
          else {
            // All attempts failed, use placeholder
            console.error('All image loading attempts failed:', {
              originalUrl: url,
              extractedFilename,
              attemptedPath: imagePath,
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
      
      img.src = imagePath;
    };
    
    // Start with the original extracted filename
    tryLoadImage(extractedFilename, 'original');
    
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
