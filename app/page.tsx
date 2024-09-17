// /app/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import FileManagement from './components/FileManagement'
import Dashboard from './components/Dashboard'

interface Topic {
  id: number
  name: string
  icon: string
}

interface Chat {
  id: string
  topic: string
  messages: ChatMessage[]
  label: string | null
  date: Date
}

// Define the ChatMessage interface
export interface ChatMessage {
  text: string; // The content of the message
  sender: 'user' | 'ai'; // Indicates who sent the message
  type?: string; // Optional type property (e.g., 'text', 'image', etc.)
  timestamp?: Date; // Optional timestamp for when the message was sent
}

export default function FinancialAnalysisApp() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([]) // {{ edit_2 }}
  const [inputMessage, setInputMessage] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showFileManagement, setShowFileManagement] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const chatFileInputRef = useRef<HTMLInputElement | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false); // {{ edit_1 }} Add state for chat visibility

  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      updateChatHistory(currentChatId, messages)
    }
  }, [messages])

  const createNewChat = (topic: Topic | null = null) => {
    const newChatId = Date.now().toString()
    const newChat: Chat = {
      id: newChatId,
      topic: topic ? topic.name : 'New Chat',
      messages: [],
      label: topic ? topic.name : null,
      date: new Date()
    }
    setChatHistory(prevHistory => [newChat, ...prevHistory])
    setCurrentChatId(newChatId)
    setSelectedTopic(topic)
    setMessages([])
    setShowFileManagement(false)
    setIsChatOpen(true); // {{ edit_2 }} Set chat as open when creating a new chat
  }

  const updateChatHistory = (chatId: string, updatedMessages: ChatMessage[]) => {
    setChatHistory(prevHistory =>
      prevHistory.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: updatedMessages, topic: detectTopic(updatedMessages[0]?.text) }
          : chat
      )
    )
  }

  const detectTopic = (message: string): string => {
    if (!message) return 'New Chat'
    if (message.toLowerCase().includes('cogs')) return 'COGS Analysis'
    if (message.toLowerCase().includes('revenue')) return 'Revenue Analysis'
    if (message.toLowerCase().includes('benchmark')) return 'Benchmarking'
    return 'Financial Analysis'
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: ChatMessage = { text: inputMessage, sender: 'user' } // {{ edit_3 }}
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputMessage('')
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "I'm analyzing your financial data. Please wait.", sender: 'ai' }])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isChat = false) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setUploadedFiles(prevFiles => [...newFiles, ...prevFiles])
      if (isChat) {
        const fileNames = newFiles.map(file => file.name).join(', ')
        const newMessage: ChatMessage = { text: `Uploaded files: ${fileNames}`, sender: 'user' } // {{ edit_4 }}
        setMessages(prevMessages => [...prevMessages, newMessage])
      }
    }
  }

  const groupChatsByDate = (): { [key: string]: Chat[] } => {
    const groups: { [key: string]: Chat[] } = {
      'Today': [],
      'Yesterday': [],
      'Last 7 Days': [],
      'Last 30 Days': [],
      'Older': []
    }

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setDate(lastMonth.getDate() - 30)

    chatHistory.forEach(chat => {
      const chatDate = new Date(chat.date)
      if (chatDate.toDateString() === today.toDateString()) {
        groups['Today'].push(chat)
      } else if (chatDate.toDateString() === yesterday.toDateString()) {
        groups['Yesterday'].push(chat)
      } else if (chatDate > lastWeek) {
        groups['Last 7 Days'].push(chat)
      } else if (chatDate > lastMonth) {
        groups['Last 30 Days'].push(chat)
      } else {
        groups['Older'].push(chat)
      }
    })

    return groups
  }

  const openNewChat = () => {
    setIsChatOpen(true); // {{ edit_3 }} Function to open new chat
  }

  const handleHomeClick = () => {
    setSelectedTopic(null)
    setShowFileManagement(false)
    setIsChatOpen(false) // {{ edit_4 }} Close chat when returning to home
  }

  const deleteChat = (chatId: string) => {
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <Sidebar
        chatHistory={chatHistory}
        setSelectedTopic={(topic) => {
          setSelectedTopic(topic)
          handleHomeClick()
        }}
        setShowFileManagement={setShowFileManagement}
        createNewChat={createNewChat}
        setCurrentChatId={setCurrentChatId}
        setMessages={setMessages}
        groupChatsByDate={groupChatsByDate}
        deleteChat={deleteChat}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          {messages.length === 0 ? (
            <p className="text-4xl font-semibold text-[#204B44] text-center leading-relaxed">
              Hi! I am your personal Finance Analyst<br />
              How can I help you?
            </p>
          ) : (
            <div className="w-full h-full overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={index} className={`p-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full">
          <ChatInterface
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            chatFileInputRef={chatFileInputRef}
            handleFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
          />
        </div>
      </div>
    </div>
  )
}

