'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'
import FileManagement from '../components/FileManagement'
import { Message, Chat } from '@/types'

export default function FileManagementPage() {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showFileManagement, setShowFileManagement] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load chat history from localStorage
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString()
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      date: new Date(),
      messages: []
    } as Chat

    const updatedChatHistory = [newChat, ...chatHistory]
    setChatHistory(updatedChatHistory)
    localStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory))

    // Navigate to the home page with the new chat ID
    router.push(`/?chatId=${newChatId}`)
  }

  const groupChatsByDate = (): { [key: string]: Chat[] } => {
    return chatHistory.reduce((groups, chat) => {
      const date = new Date(chat.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(chat);
      return groups;
    }, {} as { [key: string]: Chat[] });
  }

  const deleteChat = (id: string) => {
    // Implement deleteChat logic here
    // This should be similar to the logic in the main page
  }

  const handleChatSelect = (chatId: string) => {
    // This function won't be called directly on the settings page
    // It's here for type consistency with the Sidebar props
  }

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prevFiles => [...files, ...prevFiles]);
  };

  const refreshHomePage = () => {} // Add this dummy function

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <Sidebar
        chatHistory={chatHistory}
        setSelectedTopic={setSelectedTopic}
        setShowFileManagement={setShowFileManagement}
        createNewChat={createNewChat}
        setCurrentChatId={setCurrentChatId}
        groupChatsByDate={groupChatsByDate}
        setMessages={setMessages}
        deleteChat={deleteChat}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        isMainPage={false} // Add this prop
      />
      <FileManagement
        uploadedFiles={uploadedFiles}
        handleFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
        setUploadedFiles={setUploadedFiles}
      />
    </div>
  )
}
