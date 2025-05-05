
import { useState, useEffect } from 'react';
import { getProxiedImageUrl } from '@/lib/imageUtils';

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
    
    // Get the local image URL
    const localImageUrl = getProxiedImageUrl(url);
    
    // Create an Image object to preload
    const img = new Image();
    
    img.onload = () => {
      if (isMounted) {
        setState({ loadedUrl: localImageUrl, isLoading: false, error: false });
      }
    };
    
    img.onerror = () => {
      if (isMounted) {
        console.error('Error al cargar imagen local:', localImageUrl);
        setState({ 
          loadedUrl: '/placeholder.svg', 
          isLoading: false, 
          error: true 
        });
      }
    };
    
    img.src = localImageUrl;
    
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
