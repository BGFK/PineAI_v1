'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { colors } from '@/components/ui/colors'

export default function LandingPage() {
  const [loginHovered, setLoginHovered] = useState(false)
  const [signupHovered, setSignupHovered] = useState(false)
  const [animatedText, setAnimatedText] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const router = useRouter()

  const fullText = "PineAI - Your personal Finance Assistant that helps you make better decisions."

  useEffect(() => {
    let index = 0
    const intervalId = setInterval(() => {
      if (!isPaused) {
        setAnimatedText((prev) => {
          if (index < fullText.length) {
            index++
            return fullText.slice(0, index)
          } else {
            setIsPaused(true)
            setTimeout(() => {
              setIsPaused(false)
              index = 0
            }, 3000)
            return prev
          }
        })
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [isPaused])

  const handleLoginClick = () => {
    router.push('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative" style={{ backgroundColor: colors.pine['Pine Green'] }}>
      <div className="flex flex-col items-center mb-16">
        <Image
          src="/pine_logo_white_text.png"
          alt="Pine Logo"
          width={400}
          height={133}
          priority
        />
        <div className="mt-[100px] h-16 text-white text-4xl font-light">
          {animatedText}
        </div>
      </div>
      <div className="absolute bottom-16 space-x-14">
        <button 
          className="px-8 py-3 text-lg border-2 border-white rounded-md transition-colors w-40"
          style={{ 
            backgroundColor: loginHovered ? 'transparent' : 'white',
            color: loginHovered ? 'white' : colors.pine['Pine Green']
          }}
          onMouseEnter={() => setLoginHovered(true)}
          onMouseLeave={() => setLoginHovered(false)}
          onClick={handleLoginClick}
        >
          Login
        </button>
        <button 
          className="px-8 py-3 text-lg border-2 border-white rounded-md transition-colors w-40"
          style={{ 
            backgroundColor: signupHovered ? 'transparent' : 'white',
            color: signupHovered ? 'white' : colors.pine['Pine Green']
          }}
          onMouseEnter={() => setSignupHovered(true)}
          onMouseLeave={() => setSignupHovered(false)}
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}

