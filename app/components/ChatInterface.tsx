// /app/components/ChatInterface.tsx
'use client'

import React, { useState } from 'react'
import { readStreamableValue } from 'ai/rsc';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PaperclipIcon, AddIcon, DiscardIcon } from '@/components/ui/icons'
import { ChatMessage } from '../PineChat/page' // Import ChatMessage from page.tsx
import { streamMessage, ChatMessage as StreamChatMessage } from '../../actions/stream-message';
import { chatText } from '@/components/ui/typography'
import { colors } from '@/components/ui/colors'

interface ChatInterfaceProps { // Renamed interface for clarity
  messages: ChatMessage[]; // Accept ChatMessage[] type
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (message: string) => void; // Renamed from handleSendMessage
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chatFileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFiles: File[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isStreaming: boolean;
  streamedMessage: string;
  handleRemoveFile: (index: number) => void; // Add this prop
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  onSendMessage, // This prop is now used
  handleKeyPress,
  chatFileInputRef,
  handleFileUpload,
  uploadedFiles,
  setMessages,
  isStreaming,
  streamedMessage,
  handleRemoveFile,
}) => {
  // Remove the local state and handleSendMessage function
  
  return (
    <div className="flex flex-col items-center w-full">
      {/* Messages Scroll Area */}
      <ScrollArea className="w-full max-w-[78.8%] mx-auto mb-4 flex-1">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.sender === 'user' 
                    ? `bg-[${colors.pine['Pine Green']}] text-white` 
                    : `bg-gray-100 text-${colors.pine['Pine Main Text']}`
                } inline-block max-w-[80%] ${chatText}`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* File Uploads and Input Section */}
      <div className="w-full p-4 border-t border-gray-200">
        <div className="w-full max-w-[80%] mx-auto">
          {/* Uploaded Files and Paperclip Button */}
          <div className="flex flex-wrap items-center gap-1 mb-3">
            {uploadedFiles.slice(0, 6).map((file, index) => (
              <div key={index} className="relative group">
                <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {file.name}
                </div>
                <button
                  className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 rounded-full p-0.5 hidden group-hover:block"
                  onClick={() => handleRemoveFile(index)}
                >
                  <DiscardIcon className="h-2 w-2 text-white" />
                </button>
              </div>
            ))}
            {uploadedFiles.length > 0 && (
              <Button variant="ghost" size="sm" className="p-1" onClick={() => chatFileInputRef.current?.click()}>
                <AddIcon className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => chatFileInputRef.current?.click()}>
              <PaperclipIcon className="h-4 w-4 text-gray-500" />
            </Button>
            <input type="file" ref={chatFileInputRef} onChange={handleFileUpload} className="hidden" multiple />
          </div>

          {/* Chat Input */}
          <div className="flex items-center space-x-2 mt-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your financial data..."
              className={`flex-1 ${chatText} text-${colors.pine['Pine Main Text']}`}
            />
            <Button onClick={() => onSendMessage(inputMessage)} className={`bg-[${colors.pine['Pine Green']}] hover:bg-[#1a3e39] text-white ${chatText}`}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;