// /app/components/Sidebar.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HomeIcon, MessageIcon, NewChatIcon, FolderIcon, SettingsIcon, UserIcon, DeleteIcon } from '@/components/ui/icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heading, BodyText, SmallText } from '@/components/ui/typography';

interface SidebarProps {
  chatHistory: any[]
  setSelectedTopic: (topic: any) => void
  setShowFileManagement: (value: boolean) => void
  createNewChat: (topic?: any) => void
  setCurrentChatId: (id: string) => void
  setMessages: (messages: any[]) => void
  groupChatsByDate: () => { [key: string]: any[] }
  deleteChat: (id: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  chatHistory,
  setSelectedTopic,
  setShowFileManagement,
  createNewChat,
  setCurrentChatId,
  setMessages,
  groupChatsByDate,
  deleteChat
}) => {
  const router = useRouter()
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  const handleHomeClick = () => {
    setSelectedTopic(null)
    setShowFileManagement(false)
    router.push('/')
  }

  const handleSettingsClick = () => {
    router.push('/settings')
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <div className="mb-8">
          <Image
            src="/pine_logo_green_text.png"
            alt="Pine Logo"
            width={160}
            height={53}
          />
        </div>
        <Button
          className="w-full justify-start text-left hover:bg-gray-100 py-2.5 px-3"
          variant="ghost"
          onClick={handleHomeClick}
        >
          <HomeIcon className="mr-3 h-5 w-5" />
          <Heading>Home</Heading>
        </Button>
      </div>
      <div className="px-4 pb-2 pt-6"> {/* Added pt-2.5 for 10px top padding */}
        <Button
          className="w-full justify-start text-left hover:bg-gray-100 py-2.5 px-3"
          variant="ghost"
          onClick={() => createNewChat()}
        >
          <NewChatIcon className="mr-3 h-5 w-5" />
          <BodyText>New Chat</BodyText>
        </Button>
      </div>
      <ScrollArea className="flex-1 pt-1"> {/* Added pt-2.5 for 10px top padding */}
        <div className="px-4 space-y-4">
          {Object.entries(groupChatsByDate()).map(([group, chats]) => (
            chats.length > 0 && (
              <div key={group} className="space-y-1">
                <SmallText className="text-gray-500 px-3">{group}</SmallText>
                <div className="space-y-0">
                  {chats.map((chat, index) => (
                    <div key={chat.id} className="flex items-center group hover:bg-gray-100 rounded-md">
                      <Button
                        className="flex-grow justify-start text-left font-normal py-2.5 px-3"
                        variant="ghost"
                        onClick={() => {
                          setCurrentChatId(chat.id)
                          setMessages(chat.messages)
                          setSelectedTopic({ name: chat.label })
                          setShowFileManagement(false)
                        }}
                      >
                        <div className="flex items-center">
                          <MessageIcon className="mr-3 h-5 w-5" />
                          <div className="flex flex-col items-start">
                            <BodyText>{`Chat ${index + 1}`}</BodyText>
                            {chat.label && (
                              <SmallText className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full mt-1">
                                {chat.label}
                              </SmallText>
                            )}
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteChat(chat.id)}
                      >
                        <DeleteIcon className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
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
          onClick={() => setShowFileManagement(true)}
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
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
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
