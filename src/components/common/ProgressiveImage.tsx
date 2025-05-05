
import { useProgressiveImage } from '@/hooks/useProgressiveImage';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { extractFilenameFromUrl } from '@/lib/imageUtils';

interface ProgressiveImageProps {
  url: string;
  alt: string;
  className?: string;
  objectFit?: "contain" | "cover";
}

export function ProgressiveImage({ 
  url, 
  alt, 
  className = "h-32 w-full", 
  objectFit = "contain" 
}: ProgressiveImageProps) {
  const { loadedUrl, isLoading, error } = useProgressiveImage(url);
  
  if (isLoading) {
    return <Skeleton className={className} />
  }
  
  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded`}>
        <div className="text-center text-gray-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-1" />
          <p className="text-xs">Error de imagen</p>
          <p className="text-xs truncate max-w-32">{extractFilenameFromUrl(url)}</p>
        </div>
      </div>
    );
  }
  
  return (
    <img
      src={loadedUrl}
      alt={alt}
      className={`${className} object-${objectFit} rounded`}
      loading="lazy"
    />
  );
}
