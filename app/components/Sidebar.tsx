// /app/components/Sidebar.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HomeIcon, MessageIcon, NewChatIcon, FolderIcon, SettingsIcon, UserIcon, DeleteIcon } from '@/components/ui/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Heading, BodyText, SmallText } from '@/components/ui/typography';
import { Chat, Message } from '@/types'
import { colors } from '@/components/ui/colors'
import { cn } from "@/lib/utils"  // Make sure this utility is imported
import dynamic from 'next/dynamic'

const DynamicChatInterface = dynamic(() => import('../components/ChatInterface'), { ssr: false })

interface SidebarProps {
  chatHistory: Chat[]
  setSelectedTopic: (topic: any) => void
  setShowFileManagement: (value: boolean) => void
  createNewChat: () => void
  setCurrentChatId: (id: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  groupChatsByDate: () => { [key: string]: Chat[] }
  deleteChat: (id: string) => void
  currentChatId: string | null
  onChatSelect: (chatId: string) => void;
  isMainPage: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatHistory,
  setSelectedTopic,
  setShowFileManagement,
  createNewChat,
  setCurrentChatId,
  setMessages,
  groupChatsByDate,
  deleteChat,
  currentChatId,
  onChatSelect,
  isMainPage,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)
  const [localChatHistory, setLocalChatHistory] = useState<Chat[]>([])
  const [showNewChatTooltip, setShowNewChatTooltip] = useState(false)

  useEffect(() => {
    // Load chat history from localStorage when the component mounts
    const savedChatHistory = localStorage.getItem('chatHistory');
    if (savedChatHistory) {
      const parsedHistory = JSON.parse(savedChatHistory);
      setLocalChatHistory(parsedHistory);

      // Check if there's a chatId in the URL
      const chatId = searchParams.get('chatId')
      if (chatId) {
        onChatSelect(chatId)
      }
    }
  }, [searchParams, onChatSelect])

  const handleHomeClick = () => {
    // Navigate to the home page (app/home/page.tsx)
    router.push('/home')
  }

  const handleSettingsClick = () => {
    router.push('/settings')
  }

  const handleChatClick = (chatId: string) => {
    if (isMainPage) {
      onChatSelect(chatId);
    }
  };

  const getFirstMessagePreview = (chat: Chat) => {
    const firstMessage = chat.messages.find(msg => msg.sender === 'user');
    if (firstMessage) {
      const words = firstMessage.content.split(' ');
      const preview = words.slice(0, 10).join(' ');
      if (preview.length > 50) {
        return preview.slice(0, 47) + '...';
      }
      return preview + (words.length > 10 ? '...' : '');
    }
    return 'Current Chat';
  };

  const handleFileManagementClick = () => {
    router.push('/file-management')
  }

  const handleNewChat = () => {
    if (chatHistory.length > 0) {
      createNewChat();
    }
  };

  return (
    <div className="w-[280px] bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <div className="mb-8 pl-3"> {/* Added pl-3 to align with button content */}
          <Image
            src="/pine_logo_green_text.png"
            alt="Pine Logo"
            width={160}
            height={53}
            style={{ width: '80%', height: 'auto' }}
            priority
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 rounded-md">
            <Button
              className="flex-grow flex justify-start items-center text-left py-2.5 px-3"
              variant="ghost"
              onClick={handleHomeClick}
            >
              <HomeIcon className="h-5 w-5 mr-3" />
              <Heading>Home</Heading>
            </Button>
            <div className="pr-3 flex items-center h-full">
              <Button
                className={`p-0 w-5 h-5 hover:bg-gray-200 ${chatHistory.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  if (chatHistory.length > 0) handleNewChat();
                }}
                title={chatHistory.length > 0 ? "New Chat" : "Create your first chat to enable this button"}
                disabled={chatHistory.length === 0}
              >
                <NewChatIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 pt-1">
        <div className="px-4 space-y-4">
          {Object.entries(groupChatsByDate()).map(([group, chats]) => (
            chats.length > 0 && (
              <div key={group} className="space-y-1">
                <SmallText className="text-gray-500 px-3">{group}</SmallText>
                <div className="space-y-0">
                  {chats.map((chat) => (
                    <div key={chat.id} className="flex items-center">
                      {isMainPage ? (
                        <Button
                          className="flex-grow justify-start text-left font-normal py-2.5 px-3 bg-gray-50 relative w-full"
                          variant="ghost"
                          onClick={() => handleChatClick(chat.id)}
                        >
                          <div className="flex items-center w-full pr-8">
                            <MessageIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <div className="flex-grow overflow-hidden">
                              <BodyText className="truncate">
                                {getFirstMessagePreview(chat)}
                              </BodyText>
                              {chat.label && (
                                <SmallText className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full mt-1 inline-block">
                                  {chat.label}
                                </SmallText>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 absolute right-1 top-1/2 transform -translate-y-1/2"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.id);
                              }}
                            >
                              <DeleteIcon className="h-5 w-5 text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700" />
                            </Button>
                          </div>
                        </Button>
                      ) : (
                        <Link href={`/chat/${chat.id}`} className="w-full">
                          <Button
                            className="flex-grow justify-start text-left font-normal py-2.5 px-3 bg-gray-50 relative w-full"
                            variant="ghost"
                          >
                            {/* Similar content as the isMainPage true case */}
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <Button
          className="w-full justify-start text-left hover:bg-gray-100 py-2.5 px-3"
          variant="ghost"
          onClick={handleFileManagementClick}
        >
          <FolderIcon className="mr-3 h-5 w-5" />
          File Management
        </Button>
      </div>
      <Separator />
      <div className="p-4 space-y-2">
        <Button 
          className="w-full justify-start text-left font-normal hover:bg-gray-100 py-2.5 px-3" 
          variant="ghost"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-5 w-5">
              <AvatarFallback>
                <UserIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">user@example.com</span>
          </div>
        </Button>
        <Button 
          className="w-full justify-start text-left font-normal hover:bg-gray-100 py-2.5 px-3" 
          variant="ghost"
          onClick={handleSettingsClick}
        >
          <SettingsIcon className="mr-3 h-5 w-5" />
          Settings
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
