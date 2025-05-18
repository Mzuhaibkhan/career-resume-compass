
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload,
  allowedTypes = ['.pdf', '.docx', '.doc'],
  maxSizeMB = 5
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileType = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedTypes.includes(fileType)) {
      return `File type ${fileType} is not supported. Please upload ${allowedTypes.join(', ')}`;
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`;
    }
    
    return null;
  };

  const handleFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
        }
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    try {
      await onFileUpload(file);
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      clearInterval(interval);
      setProgress(0);
      setUploading(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-primary bg-accent/50' : 'border-border'
        } transition-all`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={allowedTypes.join(',')}
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-muted rounded-full p-4">
            <svg
              className="w-8 h-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Upload Resume</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: {allowedTypes.join(', ')} (max {maxSizeMB}MB)
            </p>
          </div>
          
          <Button
            onClick={handleButtonClick}
            disabled={uploading}
            variant="outline"
          >
            Select File
          </Button>
        </div>
      </div>

      {uploading && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
