// /app/components/Dashboard.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"

interface DashboardProps {
  topics: { id: number, name: string, icon: string }[]
  createNewChat: (topic?: any) => void
}

const Dashboard: React.FC<DashboardProps> = ({ topics, createNewChat }) => {
  return (
    <div className="flex-1 p-6 grid grid-cols-2 gap-4">
      {topics.map((topic) => (
        <Button
          key={topic.id}
          onClick={() => createNewChat(topic)}
          className="h-40 text-left flex flex-col items-start justify-between p-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg"
        >
          <div className="text-4xl">{topic.icon}</div>
          <div>
            <div className="font-semibold text-black text-lg">{topic.name}</div>
            <div className="text-sm text-gray-500">Click to start analysis</div>
          </div>
        </Button>
      ))}
    </div>
  )
}

export default Dashboard
