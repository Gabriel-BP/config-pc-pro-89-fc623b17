
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
    let retryCount = 0;
    const maxRetries = 2;
    
    const loadImage = () => {
      // Añadir un pequeño retraso aleatorio para evitar sobrecarga
      const delay = Math.random() * 1000 + 300;
      
      setTimeout(() => {
        if (!isMounted) return;
        
        // Obtener URL con proxy
        const proxiedUrl = getProxiedImageUrl(url);
        
        // Crear un objeto Image para precargar
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          if (isMounted) {
            setState({ loadedUrl: proxiedUrl, isLoading: false, error: false });
          }
        };
        
        img.onerror = () => {
          if (!isMounted) return;
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Reintentando cargar imagen (${retryCount}/${maxRetries}): ${url}`);
            loadImage(); // Reintentar con un proxy diferente
          } else {
            console.error('Error al cargar imagen después de reintentos:', url);
            // Usar una imagen de placeholder en caso de fallo
            setState({ 
              loadedUrl: '/placeholder.svg', 
              isLoading: false, 
              error: true 
            });
          }
        };
        
        img.src = proxiedUrl;
      }, delay);
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
