// /app/components/FileManagement.tsx
'use client'

import React from 'react'
import { Upload } from 'lucide-react'

interface FileManagementProps {
  uploadedFiles: File[]
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

const FileManagement: React.FC<FileManagementProps> = ({ uploadedFiles, handleFileUpload, fileInputRef }) => {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-semibold mb-4">File Management</h2>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
        />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Recent Files</h3>
        <div className="space-y-2">
          {uploadedFiles.slice(0, 10).map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span>{file.name}</span>
              <span className="text-sm text-gray-500">{file.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FileManagement
