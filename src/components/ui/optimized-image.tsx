import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  priority = false, 
  ...props 
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={cn("relative overflow-hidden bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-[10px]">
          {error ? "Erro na imagem" : ""}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted-foreground/10" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        {...props}
      />
    </div>
  );
}
