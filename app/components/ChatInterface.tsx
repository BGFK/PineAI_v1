// /app/components/ChatInterface.tsx
'use client'

import React from 'react'
import { readStreamableValue } from 'ai/rsc';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PaperclipIcon, AddIcon, DiscardIcon } from '@/components/ui/icons'
import { ChatMessage } from '../page' // Import ChatMessage from page.tsx
import { streamMessage, ChatMessage as StreamChatMessage } from '../../actions/stream-message';
import { useEffect, useState } from 'react';

interface ChatInterfaceProps { // Renamed interface for clarity
  messages: ChatMessage[]; // Accept ChatMessage[] type
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
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
  handleSendMessage: propHandleSendMessage,
  handleKeyPress,
  chatFileInputRef,
  handleFileUpload,
  uploadedFiles,
  setMessages,
  handleRemoveFile, // Add this prop
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState('');

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Create a new message object that matches the ChatMessage type
    const newUserMessage: ChatMessage = {
      id: messages.length.toString(),
      sender: 'user',
      content: inputMessage
    };

    // Add the user message immediately
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    const currentInputMessage = inputMessage;
    setInputMessage(''); // Clear input field
    setIsStreaming(true);

    try {
      const streamMessages: StreamChatMessage[] = [
        ...messages.map((m, index) => ({
          id: index,
          role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content
        })),
        {
          id: messages.length,
          role: 'user' as const,
          content: currentInputMessage
        }
      ];

      const { output } = await streamMessage(streamMessages);

      let fullResponse = '';
      for await (const chunk of readStreamableValue(output)) {
        fullResponse += chunk;
        setStreamedMessage(prevStreamed => prevStreamed + chunk);
      }

      setMessages(prevMessages => [
        ...prevMessages,
        { id: (prevMessages.length + 1).toString(), sender: 'ai', content: fullResponse }
      ]);
    } catch (error) {
      console.error('Error streaming message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { id: (prevMessages.length + 1).toString(), sender: 'ai', content: 'Sorry, an error occurred while processing your request.' }
      ]);
    } finally {
      setStreamedMessage('');
      setIsStreaming(false);
    }
  };

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
                className={`p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-[#204B44] text-white' 
                    : 'bg-gray-100 text-gray-800'
                } inline-block max-w-[80%]`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isStreaming && streamedMessage && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-800 inline-block max-w-[80%]">
                {streamedMessage}
              </div>
            </div>
          )}
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
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-[#204B44] hover:bg-[#1a3e39] text-white">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
