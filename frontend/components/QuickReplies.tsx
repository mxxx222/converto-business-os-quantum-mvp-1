/**
 * QuickReplies Component
 * Mobile-friendly quick action buttons
 */

import Link from "next/link";

interface QuickReply {
  label: string;
  href: string;
}

interface QuickRepliesProps {
  items: QuickReply[];
}

export function QuickReplies({ items }: QuickRepliesProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {items.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className="flex-shrink-0 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
