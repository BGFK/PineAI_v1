// /app/components/ChatInterface.tsx
'use client'

import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PaperclipIcon, PlusCircle } from 'lucide-react'
import { ChatMessage } from '../page' // Import ChatMessage from page.tsx

interface ChatInterfaceProps { // Renamed interface for clarity
  messages: ChatMessage[]; // Accept ChatMessage[] type
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chatFileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFiles: File[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleKeyPress,
  chatFileInputRef,
  handleFileUpload,
  uploadedFiles
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Scroll Area */}
      <ScrollArea className="flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${message.sender === 'user' ? 'bg-[#204B44] text-white ml-auto' : 'bg-gray-100 text-gray-800'} max-w-[80%]`}
          >
            {message.text}
          </div>
        ))}
      </ScrollArea>

      {/* File Uploads and Input Section */}
      <div className="p-4 border-t border-gray-200">
        {/* Uploaded Files */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {uploadedFiles.slice(0, 6).map((file, index) => (
            <div key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {file.name}
            </div>
          ))}
          <Button variant="ghost" size="sm" className="p-1" onClick={() => chatFileInputRef.current?.click()}>
            <PlusCircle className="h-4 w-4" />
          </Button>
          <input type="file" ref={chatFileInputRef} onChange={handleFileUpload} className="hidden" multiple />
        </div>

        {/* Chat Input */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => chatFileInputRef.current?.click()}>
            <PaperclipIcon className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your financial data..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="bg-[#204B44] hover:bg-[#1a3e39] text-white">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
