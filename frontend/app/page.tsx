'use client'

import { useState, useEffect } from 'react'
import { Calculator, MessageSquare, TrendingUp, Shield, Zap } from 'lucide-react'

export default function Home() {
  const [aiMessage, setAiMessage] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendAIMessage = async () => {
    if (!aiMessage.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: aiMessage }),
      })
      
      const data = await response.json()
      setAiResponse(data.response)
    } catch (error) {
      setAiResponse('Sorry, AI service is temporarily unavailable.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Converto Business OS</h1>
            </div>
            <div className="text-sm text-gray-500">
              Complete Business Management System
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Complete Business Management Solution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered business management with VAT automation, 
            and advanced security features designed for Finnish entrepreneurs.
          </p>
        <div className="mt-6 space-x-4">
          <a href="/selko/ocr" className="text-blue-700 underline">Selko Kuitti-OCR</a>
          <a href="/selko/vat" className="text-blue-700 underline">Selko ALV-laskuri</a>
          <a href="/legal/selko" className="text-blue-700 underline">Selko Legal Lite</a>
          <a href="/billing" className="text-blue-700 underline">Billing</a>
        </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Business Assistant</h3>
            <p className="text-gray-600">
              Get instant help with VAT, invoicing, and business questions in Finnish.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <Calculator className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">VAT Automation</h3>
            <p className="text-gray-600">
              Automatic VAT calculations and compliance for Finnish businesses.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Business Analytics</h3>
            <p className="text-gray-600">
              Real-time insights into your business performance and metrics.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-gray-600">
              Military-grade security with quantum-safe encryption.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Automation</h3>
            <p className="text-gray-600">
              Automated workflows and business process optimization.
            </p>
          </div>
        </div>

        {/* Dashboard and AI Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Business Dashboard</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">€50,000</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">€20,000</p>
                  <p className="text-sm text-gray-600">Profit</p>
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">1,250</p>
                <p className="text-sm text-gray-600">Customers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4">AI Business Assistant</h3>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Ask me anything about your business..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                />
              </div>
              <button
                onClick={sendAIMessage}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Thinking...' : 'Send Message'}
              </button>
              {aiResponse && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Converto Business OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


