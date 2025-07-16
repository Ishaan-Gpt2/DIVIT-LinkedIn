import { useState, useCallback } from 'react';

interface FileUploadOptions {
  maxSizeMB?: number;
  acceptedTypes?: string[];
  onSuccess?: (file: File, dataUrl: string) => void;
  onError?: (error: Error) => void;
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    maxSizeMB = 5,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'text/csv'],
    onSuccess,
    onError
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFile = useCallback((file: File): Error | null => {
    if (file.size > maxSizeBytes) {
      return new Error(`File size exceeds the maximum allowed size of ${maxSizeMB}MB`);
    }
    
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      return new Error(`File type ${file.type} is not supported. Accepted types: ${acceptedTypes.join(', ')}`);
    }
    
    return null;
  }, [maxSizeBytes, maxSizeMB, acceptedTypes]);

  const readFileAsDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const validationError = validateFile(file);
      if (validationError) {
        throw validationError;
      }
      
      const fileDataUrl = await readFileAsDataUrl(file);
      
      setFile(file);
      setDataUrl(fileDataUrl);
      
      if (onSuccess) {
        onSuccess(file, fileDataUrl);
      }
      
      return { file, dataUrl: fileDataUrl };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [validateFile, readFileAsDataUrl, onSuccess, onError]);

  const clearFile = useCallback(() => {
    setFile(null);
    setDataUrl(null);
    setError(null);
  }, []);

  return {
    file,
    dataUrl,
    isLoading,
    error,
    uploadFile,
    clearFile
  };
}