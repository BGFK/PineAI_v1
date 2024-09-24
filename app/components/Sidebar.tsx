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
import { Popover, PopoverContent, PopoverTrigger, SettingsPopoverContent } from "@/components/ui/popover"
import { OptionsIcon, PenSquareIcon, ArchiveIcon, TrashIcon } from '@/components/ui/icons'

const DynamicChatInterface = dynamic(() => import('../components/ChatInterface'), { ssr: false })

interface SidebarProps {
  chatHistory: Chat[]
  setSelectedTopic: (topic: any) => void
  setShowFileManagement: (value: boolean) => void
  createNewChat: () => void
  setCurrentChatId: (id: string | null) => void
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
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)
  const [openSettingsPopover, setOpenSettingsPopover] = useState(false);

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

  useEffect(() => {
    // Close any open popover when the chat history changes
    setOpenPopoverId(null);
  }, [chatHistory]);

  const handlePineChatClick = () => {
    // Navigate to the PineChat page (app/pine-chat/page.tsx)
    router.push('/pine-chat')
  }

  const handleSettingsClick = () => {
    setOpenSettingsPopover(!openSettingsPopover);
  }

  const handleChatClick = (chatId: string) => {
    if (isMainPage) {
      onChatSelect(chatId);
      // Close any open popover when selecting a chat
      setOpenPopoverId(null);
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

  const handleFilesClick = () => {
    router.push('/files')
  }

  const handleNewChat = () => {
    if (chatHistory.length > 0) {
      createNewChat();
      // Ensure the popover is closed when creating a new chat
      setOpenPopoverId(null);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    setOpenPopoverId(null);
    
    if (chatId === currentChatId) {
      setCurrentChatId(null);
      setMessages([]);
      // Instead of creating a new chat, we'll reset the state to show the welcome message
      router.push('/pine-chat'); // This will force a re-render of the main page
    }
  }

  return (
    <div className="w-[250px] flex flex-col" style={{ backgroundColor: colors.pine['Pine Sidebar Background'] }}>
      <div className="p-3">
        <div className="mb-8 pl-2">
          <Image
            src="/pine_logo_green_text.png"
            alt="Pine Logo"
            width={160}
            height={53}
            style={{ width: '70%', height: 'auto' }}
            priority
          />
        </div>
        <div className="space-y-0">
          {/* PineChat button */}
          <div className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 rounded-md h-[38px]">
            <Button
              className="flex-grow flex justify-start items-center text-left py-1 px-3 h-full"
              variant="ghost"
              onClick={handlePineChatClick}
            >
              <HomeIcon className="h-4 w-4 mr-3" />
              <Heading>PineChat</Heading>
            </Button>
            {/* New Chat button */}
            <div className="pr-3 flex items-center h-full">
              <Button
                className={`p-0 w-4 h-full hover:bg-gray-200 ${chatHistory.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  if (chatHistory.length > 0) handleNewChat();
                }}
                title={chatHistory.length > 0 ? "New Chat" : "Create your first chat to enable this button"}
                disabled={chatHistory.length === 0}
              >
                <NewChatIcon className="h-4 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Files button */}
          <Button
            className="w-full justify-start text-left hover:bg-gray-100 py-1 px-3 h-[38px]"
            variant="ghost"
            onClick={handleFilesClick}
          >
            <FolderIcon className="mr-3 h-4 w-4" />
            <Heading>Files</Heading>
          </Button>
        </div>
      </div>
      
      {/* Chat history */}
      <ScrollArea className="flex-1 pt-1">
        <div className="p-3 space-y-4">
          {Object.entries(groupChatsByDate()).map(([group, chats]) => (
            chats.length > 0 && (
              <div key={group} className="space-y-1">
                <BodyText className={cn("px-3", colors.pine['Pine Secondary Text'])}>{group}</BodyText>
                <div className="space-y-0">
                  {chats.map((chat) => (
                    <div key={chat.id} className="flex items-center">
                      <Button
                        className="flex-grow justify-start text-left font-normal py-1 px-3 relative w-full h-[34px]"
                        style={{
                          backgroundColor: chat.id === currentChatId ? colors.pine['Pine_ChatBox_Selected'] : '#F9FAFB'
                        }}
                        variant="chatItem"
                        onClick={() => handleChatClick(chat.id)}
                      >
                        <div className="flex items-center w-full pr-8">
                          <div className="flex-grow overflow-hidden">
                            <BodyText className="truncate">
                              {getFirstMessagePreview(chat)}
                            </BodyText>
                          </div>
                          <Popover 
                            open={openPopoverId === chat.id} 
                            onOpenChange={(open) => {
                              if (!open) {
                                setOpenPopoverId(null);
                              }
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 absolute right-1 top-1/2 transform -translate-y-1/2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenPopoverId(openPopoverId === chat.id ? null : chat.id);
                                }}
                              >
                                <OptionsIcon className="h-4 w-5 text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent onDelete={() => handleDeleteChat(chat.id)}>
                              {/* The content is now defined in the PopoverContent component */}
                            </PopoverContent>
                          </Popover>
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 space-y-0">
        <Button 
          className="w-full justify-start text-left font-normal hover:bg-gray-100 py-1 px-3 h-[38px]" 
          variant="ghost"
        >
          <UserIcon className="mr-3 h-4 w-5" />
          <Heading>user@example.com</Heading>
        </Button>
        <Popover 
          open={openSettingsPopover} 
          onOpenChange={setOpenSettingsPopover}
        >
          <PopoverTrigger asChild>
            <Button 
              className="w-full justify-start text-left font-normal hover:bg-gray-100 py-1 px-3 h-[38px]" 
              variant="ghost"
              onClick={handleSettingsClick}
            >
              <SettingsIcon className="mr-3 h-4 w-5" />
              <Heading>Settings</Heading>
            </Button>
          </PopoverTrigger>
          <SettingsPopoverContent />
        </Popover>
      </div>
    </div>
  )
}

export default Sidebar
