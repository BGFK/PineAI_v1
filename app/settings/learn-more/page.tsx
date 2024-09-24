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
  const [content, setContent] = useState<string>('Über Pine')

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

  const handleButtonClick = (content: string) => {
    setContent(content);
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
      <div className="flex-1 p-8 flex" style={{ marginLeft: '250px' }}>
        <div className="flex flex-col">
          <button
            onClick={() => handleButtonClick('Über Pine')}
            className="px-4 py-2 text-left text-gray-800 rounded"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.pine['Pine Green'];
              e.currentTarget.style.color = colors.pine['Pine White']; // Change text color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.pine['Pine Main Text']; // Revert text color
            }}
          >
            Über Pine
          </button>
          <button
            onClick={() => handleButtonClick('AGB')}
            className="px-4 py-2 text-left text-gray-800 rounded"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.pine['Pine Green'];
              e.currentTarget.style.color = colors.pine['Pine White']; // Change text color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.pine['Pine Main Text']; // Revert text color
            }}
          >
            AGB
          </button>
          <button
            onClick={() => handleButtonClick('Datenschutzerklärung')}
            className="px-4 py-2 text-left text-gray-800 rounded"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.pine['Pine Green'];
              e.currentTarget.style.color = colors.pine['Pine White']; // Change text color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.pine['Pine Main Text']; // Revert text color
            }}
          >
            Datenschutzerklärung
          </button>
          <button
            onClick={() => handleButtonClick('Impressum')}
            className="px-4 py-2 text-left text-gray-800 rounded"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.pine['Pine Green'];
              e.currentTarget.style.color = colors.pine['Pine White']; // Change text color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.pine['Pine Main Text']; // Revert text color
            }}
          >
            Impressum
          </button>
        </div>
        <div className="flex-1 p-4 px-10">
          {content && (
            <div>
              <h2 className="text-xl font-bold mb-4">{content}</h2>
              <p>This is the content for {content}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
