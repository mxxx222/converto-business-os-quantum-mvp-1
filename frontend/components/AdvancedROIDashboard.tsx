"use client"

import { useState, useEffect } from "react"
import { conversionTracker } from "@/lib/conversion-tracking"
import { crmIntegration } from "@/lib/crm-integration"

export default function AdvancedROIDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [metrics, setMetrics] = useState({
    conversion: { views: 0, pilots: 0, signups: 0, payments: 0, pilotConversion: '0', signupConversion: '0', paymentConversion: '0' },
    crm: { total: 0, pilots: 0, demos: 0, qualified: 0, customers: 0, pilotToDemo: '0', demoToQualified: '0', qualifiedToCustomer: '0', overallConversion: '0' },
  })

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        conversion: conversionTracker.getConversionFunnel(),
        crm: crmIntegration.getConversionMetrics(),
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const calculateROI = () => {
    const { payments } = metrics.conversion
    const avgOrderValue = 89 // Average monthly subscription
    const monthlyRevenue = payments * avgOrderValue
    const marketingCost = 2000 // Estimated monthly marketing spend
    const roi = marketingCost > 0 ? ((monthlyRevenue - marketingCost) / marketingCost * 100).toFixed(0) : '0'
    return { monthlyRevenue, roi }
  }

  const { monthlyRevenue, roi } = calculateROI()

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 bg-green-600 text-white rounded-lg px-3 py-2 shadow-lg hover:bg-green-700 transition-colors z-40 text-xs font-bold"
      >
        📊 ROI
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 text-xs z-40 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Advanced ROI Dashboard</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Conversion Funnel */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Conversion Funnel</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Views:</span>
            <span className="font-mono">{metrics.conversion.views}</span>
          </div>
          <div className="flex justify-between">
            <span>Pilots:</span>
            <span className="font-mono">{metrics.conversion.pilots} ({metrics.conversion.pilotConversion}%)</span>
          </div>
          <div className="flex justify-between">
            <span>Signups:</span>
            <span className="font-mono">{metrics.conversion.signups} ({metrics.conversion.signupConversion}%)</span>
          </div>
          <div className="flex justify-between">
            <span>Payments:</span>
            <span className="font-mono">{metrics.conversion.payments} ({metrics.conversion.paymentConversion}%)</span>
          </div>
        </div>
      </div>

      {/* CRM Pipeline */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">CRM Pipeline</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Total Leads:</span>
            <span className="font-mono">{metrics.crm.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Demos:</span>
            <span className="font-mono">{metrics.crm.demos} ({metrics.crm.pilotToDemo}%)</span>
          </div>
          <div className="flex justify-between">
            <span>Qualified:</span>
            <span className="font-mono">{metrics.crm.qualified} ({metrics.crm.demoToQualified}%)</span>
          </div>
          <div className="flex justify-between">
            <span>Customers:</span>
            <span className="font-mono">{metrics.crm.customers} ({metrics.crm.qualifiedToCustomer}%)</span>
          </div>
        </div>
      </div>

      {/* ROI Summary */}
      <div className="pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-800 font-bold">ROI</div>
            <div className="text-green-600 font-mono">{roi}%</div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-blue-800 font-bold">MRR</div>
            <div className="text-blue-600 font-mono">{monthlyRevenue}€</div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <div className="text-gray-600">Overall Conversion</div>
          <div className="font-bold text-purple-600">{metrics.crm.overallConversion}%</div>
        </div>
      </div>
    </div>
  )
}