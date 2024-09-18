import React, { useState } from 'react';
import { colors } from '../../components/ui/colors';

interface ForgotPasswordProps {
  onClose: () => void;
}

export default function ForgotPassword({ onClose }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
    // You might want to show a success message or close the modal here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-[400px]">
        <h2 className="text-2xl font-bold mb-4 text-[#2E3A59]">Setze dein Passwort zurück.</h2>
        <p className="text-sm text-gray-600 mb-6">
          Geben Sie Ihre E-Mail-Adresse ein und wir werden Ihnen Anweisungen zum Zurücksetzen Ihres Passworts zusenden.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail-Adresse*
            </label>
            <input
              type="email"
              id="email"
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
            Fortfahren
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-[${colors.pine['Pine Green']}] hover:underline"
        >
          <a href="/login" className="text-[${colors.pine['Pine Green']}] hover:underline">Zurück zu Pine</a>
        </button>
      </div>
    </div>
  );
}
