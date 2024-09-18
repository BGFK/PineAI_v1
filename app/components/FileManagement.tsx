// /app/components/FileManagement.tsx
'use client'

import React, { useState, useRef } from 'react'
import { Upload, Trash2, RefreshCw, Check, Plus, X } from 'lucide-react'
import { colors } from '../../components/ui/colors'

interface FileManagementProps {
  uploadedFiles: File[]
  handleFileUpload: (files: File[]) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>
}

const FileManagement: React.FC<FileManagementProps> = ({ uploadedFiles, handleFileUpload, fileInputRef, setUploadedFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileCategories, setFileCategories] = useState<{[key: string]: string}>({});
  const [showFileSelection, setShowFileSelection] = useState(false);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setShowFileSelection(true);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(files => {
      const updatedFiles = files.filter((_, i) => i !== index);
      if (updatedFiles.length === 0) {
        setShowFileSelection(false);
      }
      return updatedFiles;
    });
  };

  const addMoreFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(files => [...files, ...Array.from(e.target.files || [])]);
    }
  };

  const handleCategoryChange = (index: number, category: string) => {
    setFileCategories(prev => ({ ...prev, [index]: category }));
  };

  const confirmUpload = () => {
    handleFileUpload(selectedFiles);
    setShowFileSelection(false);
    setSelectedFiles([]);
    setFileCategories({});
  };

  const updateFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFilesState, setSelectedFilesState] = useState<Set<number>>(new Set());

  const handleDelete = (index: number) => {
    try {
      if (index < 0 || index >= uploadedFiles.length) {
        console.error(`Invalid index: ${index}`);
        return;
      }
      
      setUploadedFiles(prevFiles => {
        const newFiles = prevFiles.filter((_, i) => i !== index);
        console.log('Files after deletion:', newFiles);
        return newFiles;
      });
      console.log(`File at index ${index} deleted successfully`);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  const handleUpdate = (index: number) => {
    if (updateFileInputRef.current) {
      updateFileInputRef.current.click();
      updateFileInputRef.current.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const newFile = target.files[0];
          if (newFile.type === uploadedFiles[index].type) {
            setUploadedFiles(prevFiles => {
              const newFiles = [...prevFiles];
              newFiles[index] = newFile;
              return newFiles;
            });
            console.log(`File at index ${index} updated successfully`);
          } else {
            console.error('New file must be of the same type as the original file');
          }
        }
      };
    }
  };

  const toggleFileSelection = (index: number) => {
    setSelectedFilesState(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-semibold mb-4">File Management</h2>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop multiple files</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelection}
          className="hidden"
          multiple
        />
      </div>
      
      {showFileSelection && selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                <span className="flex-grow truncate">{file.name}</span>
                <select
                  className="ml-2 p-1 rounded border"
                  value={fileCategories[index] || ''}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="other">Other</option>
                </select>
                <button
                  onClick={() => removeSelectedFile(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <input
                type="file"
                onChange={addMoreFiles}
                className="hidden"
                id="add-more-files"
                multiple
              />
              <label
                htmlFor="add-more-files"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More Files
              </label>
            </div>
            <button
              onClick={confirmUpload}
              className={`bg-[${colors.pine['Pine Green']}] hover:bg-[${colors.pine['Pine Green']}] text-white font-bold py-2 px-4 rounded`}
            >
              Confirm Upload
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">List of Files</h3>
        <div className="space-y-2">
          {uploadedFiles.slice(0, 10).map((file, index) => (
            <div key={`file-${index}`} className="flex items-center bg-gray-50 p-3 rounded-lg group relative overflow-hidden">
              <div className="flex items-center">
                <button
                  onClick={() => toggleFileSelection(index)}
                  className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                    ${selectedFilesState.has(index)
                      ? `bg-[${colors.pine['Pine Green']}] border-[${colors.pine['Pine Green']}]`
                      : 'bg-white border-gray-300 hover:border-[#204B44]'
                    }`}
                >
                  {selectedFilesState.has(index) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </button>
                {selectedFilesState.has(index) && (
                  <>
                    <button
                      onClick={() => handleDelete(index)}
                      className="ml-2 bg-red-600 text-white px-1 py-0.5 rounded text-xs flex items-center whitespace-nowrap"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Datei löschen
                    </button>
                    <button
                      onClick={() => handleUpdate(index)}
                      className={`ml-2 bg-[${colors.pine['Pine Green']}] text-white px-1 py-0.5 rounded text-xs flex items-center whitespace-nowrap`}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Update Datei
                    </button>
                  </>
                )}
              </div>
              <span className="ml-3 truncate">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FileManagement
