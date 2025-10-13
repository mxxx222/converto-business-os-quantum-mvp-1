"use client";
import { ProviderChip, PrivacyChip, ConfidenceChip } from "./StatusChips";
import { QuickReplies } from "./CommandPalette";

interface UnifiedHeaderProps {
  title?: string;
  confidence?: number;
  showQuickReplies?: boolean;
}

export function UnifiedHeader({ 
  title, 
  confidence = 0.92,
  showQuickReplies = true 
}: UnifiedHeaderProps) {
  return (
    <>
      {/* Status Chips - Desktop */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {title && (
                <h1 className="text-lg font-semibold text-gray-900 mr-4">
                  {title}
                </h1>
              )}
              <ProviderChip showLatency={true} />
              <PrivacyChip />
            </div>
            <ConfidenceChip confidence={confidence} />
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile */}
      {showQuickReplies && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
          <QuickReplies />
        </div>
      )}

      {/* Mobile Title */}
      {title && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
      )}
    </>
  );
}

