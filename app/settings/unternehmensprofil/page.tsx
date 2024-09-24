'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import { Message, Chat } from '@/types'
import { colors } from '../../../components/ui/colors'

const SettingsPage: React.FC = () => {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showFileManagement, setShowFileManagement] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

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

  const handleLogout = () => {
    // Implement logout logic here if needed
    router.push('/') // Navigate to the login page
  }

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
      <div className="flex-1 p-8 flex flex-col">
        {/* Removed the Settings text */}
        {/* Add your settings content here */}
        <div className="flex-grow"></div>
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: colors.pine['Pine Green'] }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
