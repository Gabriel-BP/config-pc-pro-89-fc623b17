
import { useState, useEffect } from 'react';
import { getProxiedImageUrl } from '@/lib/imageUtils';

export const useProgressiveImage = (url: string) => {
  const [loadedUrl, setLoadedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const proxiedUrl = getProxiedImageUrl(url);
    
    // Pequeño retraso aleatorio para evitar que todas las imágenes se soliciten al mismo tiempo
    const delay = Math.random() * 500;
    
    const timer = setTimeout(() => {
      setLoadedUrl(proxiedUrl);
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [url]);

  return { loadedUrl, isLoading };
};
