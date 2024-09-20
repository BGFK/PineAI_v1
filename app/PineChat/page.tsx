// /app/page.tsx
'use client'

import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import Sidebar from '../components/Sidebar'
import ChatInterface from '../components/ChatInterface'
import FileManagement from '../components/FileManagement'
import Dashboard from '../components/Dashboard'
import { streamMessage, ChatMessage as StreamChatMessage } from '../../actions/stream-message';
import { readStreamableValue } from 'ai/rsc';
import { useSearchParams } from 'next/navigation';

interface Topic {
  id: number
  name: string
  icon: string
}

interface Chat {
  id: string
  topic: string
  messages: ChatMessage[]
  label?: string // Change from 'string | null' to 'string | undefined'
  date: Date
}

// Update the ChatMessage interface
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  type?: string;
  timestamp?: Date;
}

// Update or replace the Message interface
interface Message extends ChatMessage {}

// Remove or comment out this line:
// setMessages: Dispatch<SetStateAction<Message[]>>;

export default function FinancialAnalysisApp() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([]) // {{ edit_2 }}
  const [inputMessage, setInputMessage] = useState<string>('') // Updated to initialize with an empty string
  const [chatHistory, setChatHistory] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const chatFileInputRef = useRef<HTMLInputElement | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false); // {{ edit_1 }} Add state for chat visibility
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState('');
  const [showFileManagement, setShowFileManagement] = useState(false);

  const searchParams = useSearchParams()

  useEffect(() => {
    // Load chat history from localStorage when the component mounts
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      const parsedHistory = JSON.parse(savedChatHistory);
      setChatHistory(parsedHistory);

      // Check if there's a chatId in the URL
      const chatId = searchParams.get('chatId')
      if (chatId) {
        handleChatSelect(chatId)
      }
    }
  }, [searchParams]); // Add searchParams as a dependency

  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      updateChatHistory(currentChatId, messages)
    }
  }, [messages])

  useEffect(() => {
    // Save chat history to localStorage whenever it changes
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const createNewChat = (topic: Topic | null = null) => {
    const newChatId = Date.now().toString()
    const newChat: Chat = {
      id: newChatId,
      topic: topic ? topic.name : 'New Chat',
      messages: [],
      label: topic?.name, // Change from 'topic ? topic.name : null' to 'topic?.name'
      date: new Date()
    }
    setChatHistory(prevHistory => [newChat, ...prevHistory])
    setCurrentChatId(newChatId)
    setSelectedTopic(topic)
    setMessages([])
    setIsChatOpen(true); // {{ edit_2 }} Set chat as open when creating a new chat
  }

  const updateChatHistory = (chatId: string, updatedMessages: ChatMessage[]) => {
    setChatHistory(prevHistory =>
      prevHistory.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: updatedMessages, topic: detectTopic(updatedMessages[0]?.content) }
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

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    let newChatId = currentChatId;
    let isNewChat = false;

    // Create a new chat entry if there's no current chat
    if (!currentChatId) {
      newChatId = Date.now().toString();
      setCurrentChatId(newChatId);
      isNewChat = true;
    }

    const newMessage: ChatMessage = { 
      id: Date.now().toString(), 
      content: inputMessage, 
      sender: 'user' 
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
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
          content: newMessage.content
        }
      ];

      const { output } = await streamMessage(streamMessages);

      let fullResponse = '';
      for await (const chunk of readStreamableValue(output)) {
        fullResponse += chunk;
        setStreamedMessage(prevStreamed => prevStreamed + chunk);
      }

      const aiResponse: ChatMessage = { 
        id: Date.now().toString(), 
        content: fullResponse, 
        sender: 'ai' 
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);

      // After successfully sending the message and getting a response:
      if (isNewChat) {
        const newChat: Chat = {
          id: newChatId!,
          topic: detectTopic(inputMessage),
          messages: [newMessage, aiResponse],
          date: new Date()
        };
        setChatHistory(prevHistory => [newChat, ...prevHistory]);
      } else {
        updateChatHistory(newChatId!, [...messages, newMessage, aiResponse]);
      }
    } catch (error) {
      console.error('Error streaming message:', error);
      const errorMessage: ChatMessage = { 
        id: Date.now().toString(), 
        content: 'Sorry, an error occurred while processing your request.', 
        sender: 'ai' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      // Update chat history with error message
      if (isNewChat) {
        const newChat: Chat = {
          id: newChatId!,
          topic: 'Error',
          messages: [newMessage, errorMessage],
          date: new Date()
        };
        setChatHistory(prevHistory => [newChat, ...prevHistory]);
      } else {
        updateChatHistory(newChatId!, [...messages, newMessage, errorMessage]);
      }
    } finally {
      setStreamedMessage('');
      setIsStreaming(false);
    }
  };

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
        const newMessage: ChatMessage = { 
          id: Date.now().toString(), 
          content: `Uploaded files: ${fileNames}`, 
          sender: 'user' 
        };
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
    setIsChatOpen(false) // {{ edit_4 }} Close chat when returning to home
  }

  const deleteChat = (chatId: string) => {
    setChatHistory(prevHistory => prevHistory.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      createNewChat(); // This will create a new chat immediately
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleChatSelect = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
      setSelectedTopic({ name: selectedChat.topic } as Topic);
      setIsChatOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      <Sidebar
        chatHistory={chatHistory}
        setSelectedTopic={setSelectedTopic}
        createNewChat={createNewChat}
        setCurrentChatId={setCurrentChatId}
        setMessages={setMessages}
        groupChatsByDate={groupChatsByDate}
        deleteChat={deleteChat}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        isMainPage={true}
        setShowFileManagement={setShowFileManagement}
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
              {/* Message rendering removed */}
            </div>
          )}
        </div>
        <div className="w-full">
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            chatFileInputRef={chatFileInputRef}
            handleFileUpload={handleFileUpload}
            uploadedFiles={uploadedFiles}
            isStreaming={isStreaming}
            streamedMessage={streamedMessage}
            handleRemoveFile={handleRemoveFile}
          />
        </div>
      </div>
    </div>
  )
}