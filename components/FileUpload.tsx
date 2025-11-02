import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, SpinnerIcon } from './Icons';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleScanClick = () => {
      if (selectedFile) {
          onFileUpload(selectedFile);
          setSelectedFile(null); // Clear selection after upload
      }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Upload a Receipt</h2>
      <div 
        onDragEnter={handleDrag}
        className="relative"
      >
        <label
          htmlFor="dropzone-file"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${dragActive ? 'border-indigo-400 bg-gray-700' : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'}`}
        >
          <div className="flex flex-col items-center justify-center">
            <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-1 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, or GIF</p>
          </div>
          <input
            ref={inputRef}
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleChange}
            disabled={isLoading}
          />
        </label>
      </div>
      {selectedFile && (
        <div className="mt-4 text-sm text-gray-300">
          Selected file: <span className="font-medium text-indigo-400">{selectedFile.name}</span>
        </div>
      )}
      <button
        onClick={handleScanClick}
        disabled={!selectedFile || isLoading}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5" />
            Scanning...
          </>
        ) : "Scan Receipt"}
      </button>
    </div>
  );
};

export default FileUpload;