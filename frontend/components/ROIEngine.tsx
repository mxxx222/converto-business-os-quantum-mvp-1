"use client"

import { useState, useEffect } from "react"
import { conversionTracker } from "@/lib/conversion-tracking"

export default function ROIEngine() {
  const [funnel, setFunnel] = useState({
    views: 0,
    pilots: 0,
    signups: 0,
    payments: 0,
    pilotConversion: '0',
    signupConversion: '0',
    paymentConversion: '0',
  })

  useEffect(() => {
    const updateFunnel = () => {
      setFunnel(conversionTracker.getConversionFunnel())
    }

    updateFunnel()
    const interval = setInterval(updateFunnel, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-xs z-40 max-w-xs">
      <h3 className="font-bold mb-2">ROI Dashboard</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Views:</span>
          <span className="font-mono">{funnel.views}</span>
        </div>
        <div className="flex justify-between">
          <span>Pilots:</span>
          <span className="font-mono">{funnel.pilots} ({funnel.pilotConversion}%)</span>
        </div>
        <div className="flex justify-between">
          <span>Signups:</span>
          <span className="font-mono">{funnel.signups} ({funnel.signupConversion}%)</span>
        </div>
        <div className="flex justify-between">
          <span>Payments:</span>
          <span className="font-mono">{funnel.payments} ({funnel.paymentConversion}%)</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="text-green-600 font-bold">
          ROI: {funnel.views > 0 ? ((funnel.payments / funnel.views) * 100).toFixed(1) : '0'}%
        </div>
      </div>
    </div>
  )
}