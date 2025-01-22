import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PiSpinnerGapLight, PiX } from 'react-icons/pi';

interface FileUploadProps {
  onFileSelect?: (files: File, file_type: string) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  file_type: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = {
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxSize = 12 * 1024 * 1024,
  title = 'Preliminary Assessment Doc',
  subtitle = 'Select a file to Upload',
  description = 'or drag and drop',
  icon,
  file_type,
}) => {
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file.size > maxSize) {
        setError('File size must be less than 12MB');
        return;
      }
      if (!Object.keys(accept).includes(file.type)) {
        setError('Only doc and docx files are allowed');
        return;
      }
      setError('');
      setUploadedFile(file);
      setIsUploading(true);
      onFileSelect?.(file, file_type);
    },
    [onFileSelect, maxSize],
  );

  useEffect(() => {
    if (uploadedFile && isUploading) {
      console.log(`File uploaded: ${uploadedFile.name}`);
      setIsUploading(false);
    }
  }, [uploadedFile, isUploading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
  });

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setError('');
    setIsUploading(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    setError('');
    setIsUploading(false);
  };

  return (
    <div className="w-full sm:max-w-[calc(50%-8px)]">
      <div
        {...getRootProps()}
        className={`
          mb-4 cursor-pointer rounded-lg border-2
          border-dashed p-8 text-center
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        style={{ height: '200px' }} // Set a fixed height
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="text-[30px] text-blue-500">{icon}</div>
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-x-2">
              <p className="mt-1.5 text-sm text-gray-500">File Uploading</p>
              <PiSpinnerGapLight className="text-secondary my-3 animate-spin text-[40px]" />
              <button
                className="text-secondary mx-auto flex w-40 items-center justify-center rounded-sm border border-sky-300 bg-white p-2 text-sm"
                onClick={handleCancel}
              >
                Cancel Upload
              </button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center justify-center space-x-2">
              <p className="mb-4 text-green-600">File is uploaded successfully</p>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                onClick={handleRemoveFile}
                className="color-primary mx-auto mb-1 flex items-center justify-center rounded-full bg-[#EBECED] p-1 text-sm text-gray-500 transition-colors hover:text-red-500"
                title="Remove file"
              >
                <span className="px-1 text-xs text-gray-500">{uploadedFile.name}</span>
                <PiX className="text-lg" />
              </button>
              <p className="flex justify-center text-xs text-gray-500">
                {uploadedFile.size / 1024 / 1024 < 0.1
                  ? `${(uploadedFile.size / 1024).toFixed(1)}KB`
                  : `${(uploadedFile.size / 1024 / 1024).toFixed(1)}MB`}
              </p>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500">{error}</p>}
              <p>{title}</p>
              <div className="text-gray-600">
                <p className="font-bold">{subtitle}</p>
                <p>{description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
