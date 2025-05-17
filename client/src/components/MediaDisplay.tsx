import React, { useState, useEffect } from 'react';

interface MediaDisplayProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  className?: string;
  videoClassName?: string;
  imageClassName?: string;
  onError?: (error: any) => void;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

/**
 * Component to display media (images or videos) with proper URL handling
 */
const MediaDisplay: React.FC<MediaDisplayProps> = ({
  mediaUrl,
  mediaType,
  className = '',
  videoClassName = 'w-full h-full object-cover object-center',
  imageClassName = 'w-full h-full object-cover object-center',
  onError,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false
}) => {
  const [processedUrl, setProcessedUrl] = useState<string>(mediaUrl);
  
  useEffect(() => {
    // Process the URL to ensure it's using the correct server base URL
    if (mediaUrl) {
      const serverBaseUrl = 'http://localhost:3000';
      
      // Extract the file path/name from the URL (handle both localhost:8080 and localhost:3000 URLs)
      let filePath = mediaUrl;
      
      // If it's an absolute URL, extract just the path portion
      if (mediaUrl.startsWith('http')) {
        try {
          const url = new URL(mediaUrl);
          filePath = url.pathname; // e.g., /uploads/file.mp4
        } catch (error) {
          console.error('Error parsing URL:', error);
        }
      }
      
      // Now process the file path consistently
      if (filePath.startsWith('/uploads/')) {
        // Path already has /uploads/ prefix
        setProcessedUrl(`${serverBaseUrl}${filePath}`);
      } else if (filePath.startsWith('uploads/')) {
        // Path has uploads/ without leading slash
        setProcessedUrl(`${serverBaseUrl}/${filePath}`);
      } else if (filePath.includes('/uploads/')) {
        // URL contains /uploads/ somewhere in the path
        const uploadsPart = filePath.substring(filePath.indexOf('/uploads/'));
        setProcessedUrl(`${serverBaseUrl}${uploadsPart}`);
      } else {
        // Just a filename or other path - assume it goes in uploads
        const fileName = filePath.split('/').pop(); // Get just the filename
        setProcessedUrl(`${serverBaseUrl}/uploads/${fileName}`);
      }
    }
  }, [mediaUrl]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement>) => {
    console.error(`Media loading error: ${processedUrl}`);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div className={className}>
      {mediaType === 'video' ? (
        <video
          src={processedUrl}
          className={videoClassName}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          onError={handleError}
        />
      ) : (
        <img
          src={processedUrl}
          className={imageClassName}
          alt="Media content"
          onError={handleError}
        />
      )}
    </div>
  );
};

export default MediaDisplay;
