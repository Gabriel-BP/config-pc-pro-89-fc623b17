
import { useState, useEffect } from 'react';
import { extractFilenameFromUrl, transformFilename, getImagePath } from '@/lib/imageUtils';

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
      setState({ loadedUrl: '/placeholder.svg', isLoading: false, error: true });
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: false }));
    let isMounted = true;
    
    // Extract filename from URL
    const originalFilename = extractFilenameFromUrl(url);
    console.log(`Original filename extracted: ${originalFilename}`);
    
    if (!originalFilename) {
      console.error('Could not extract filename from URL:', url);
      if (isMounted) {
        setState({ loadedUrl: '/placeholder.svg', isLoading: false, error: true });
      }
      return;
    }
    
    // First attempt: try with original filename
    const originalPath = getImagePath(originalFilename);
    console.log(`Loading image (original): ${originalPath}`);
    
    const originalImage = new Image();
    originalImage.onload = () => {
      if (isMounted) {
        console.log(`Image loaded successfully with original filename`);
        setState({ loadedUrl: originalPath, isLoading: false, error: false });
      }
    };
    
    originalImage.onerror = () => {
      if (!isMounted) return;
      
      // Second attempt: try with transformed filename (+ replaced with _)
      console.log('Original filename failed, trying transformed version');
      const transformedFilename = transformFilename(originalFilename);
      const transformedPath = getImagePath(transformedFilename);
      console.log(`Loading image (transformed): ${transformedPath}`);
      
      const transformedImage = new Image();
      transformedImage.onload = () => {
        if (isMounted) {
          console.log(`Image loaded successfully with transformed filename`);
          setState({ loadedUrl: transformedPath, isLoading: false, error: false });
        }
      };
      
      transformedImage.onerror = () => {
        if (isMounted) {
          console.error('All image loading attempts failed, using placeholder');
          setState({ loadedUrl: '/placeholder.svg', isLoading: false, error: true });
        }
      };
      
      transformedImage.src = transformedPath;
    };
    
    originalImage.src = originalPath;
    
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
