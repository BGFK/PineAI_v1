'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { colors } from '../../components/ui/colors'
import Image from 'next/image'
import ForgotPassword from '../components/ForgotPassword'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailEntered, setIsEmailEntered] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email.trim() !== '') {
      setIsEmailEntered(true)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password.trim() !== '') {
      // Handle login logic here
      console.log('Login attempted with:', { email, password })
      // Navigate to home page
      router.push('/home')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-[512px]">
        <h1 className={`text-2xl font-bold mb-6 text-left text-[${colors.pine['Pine Green']}]`}>
          {isEmailEntered ? 'Gib dein Passwort ein' : 'Willkommen zurück'}
        </h1>
        {!isEmailEntered ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder="E-Mail-Adresse"
                className="w-full px-3 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-md bg-[${colors.pine['Pine Green']}] text-white hover:bg-[${colors.pine['Pine Green']}]/80`}
            >
              Weiter
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4 flex items-center justify-between border rounded-md px-3 py-2">
              <span>{email}</span>
              <button
                type="button"
                className="text-[${colors.pine['Pine Green']}] hover:underline"
                onClick={() => setIsEmailEntered(false)}
              >
                Bearbeiten
              </button>
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Passwort*"
                className="w-full px-3 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div className="mb-4 text-sm">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-[${colors.pine['Pine Green']}] hover:underline"
              >
                Passwort vergessen?
              </button>
            </div>
            <button
              type="submit"
              className={`w-full py-2 rounded-md bg-[${colors.pine['Pine Green']}] text-white hover:bg-[${colors.pine['Pine Green']}]/80`}
            >
              Fortfahren
            </button>
          </form>
        )}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Sie haben noch kein Konto? </span>
          <a href="/register" className="text-[${colors.pine['Pine Green']}] hover:underline">Registrieren</a>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">ODER</div>
        <div className="mt-4 space-y-3">
          <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
            <Image src="/google-icon.png" alt="Google" width={20} height={20} />
            <span>Fortfahren mit Google</span>
          </button>
          <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
            <Image src="/microsoft-icon.png" alt="Microsoft" width={20} height={20} />
            <span>Fortfahren mit Microsoft Account</span>
          </button>
          <button className="w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50">
            <Image src="/apple-icon.png" alt="Apple" width={20} height={20} />
            <span>Fortfahren mit Apple</span>
          </button>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  )
}

