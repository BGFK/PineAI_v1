// /app/components/Sidebar.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, MessageSquare, PlusCircle, Folder, Settings, User } from 'lucide-react'

interface SidebarProps {
  chatHistory: any[]
  setSelectedTopic: (topic: any) => void
  setShowFileManagement: (value: boolean) => void
  createNewChat: (topic?: any) => void
  setCurrentChatId: (id: string) => void
  setMessages: (messages: any[]) => void
  groupChatsByDate: () => { [key: string]: any[] }
}

const Sidebar: React.FC<SidebarProps> = ({
  chatHistory,
  setSelectedTopic,
  setShowFileManagement,
  createNewChat,
  setCurrentChatId,
  setMessages,
  groupChatsByDate
}) => {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <Button
          className="w-full justify-start text-left font-semibold hover:bg-gray-100"
          variant="ghost"
          onClick={() => {
            setSelectedTopic(null)
            setShowFileManagement(false)
          }}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      <div className="p-4">
        <Button
          className="w-full justify-start text-left font-normal hover:bg-gray-100"
          variant="ghost"
          onClick={() => createNewChat()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupChatsByDate()).map(([group, chats]) => (
            chats.length > 0 && (
              <div key={group} className="space-y-2">
                <div className="text-xs font-medium text-gray-500">{group}</div>
                {chats.map((chat) => (
                  <Button
                    key={chat.id}
                    className="w-full justify-start text-left font-normal hover:bg-gray-100 mb-2"
                    variant="ghost"
                    onClick={() => {
                      setCurrentChatId(chat.id)
                      setMessages(chat.messages)
                      setSelectedTopic({ name: chat.label })
                      setShowFileManagement(false)
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span>{chat.topic}</span>
                      {chat.label && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full mt-1">
                          {chat.label}
                        </span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <Button
          className="w-full justify-start text-left font-normal hover:bg-gray-100"
          variant="ghost"
          onClick={() => setShowFileManagement(true)}
        >
          <Folder className="mr-2 h-4 w-4" />
          File Management
        </Button>
      </div>
      <Separator />
      <div className="p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <span className="text-sm">user@example.com</span>
        </div>
        <Button className="w-full justify-start text-left font-normal hover:bg-gray-100" variant="ghost">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}

export default Sidebar
