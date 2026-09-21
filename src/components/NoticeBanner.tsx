import React from 'react';
import { Bell } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const NoticeBanner: React.FC = () => {
  const { notices } = useClinic();

  const activeNotices = notices.filter((n) => n.isActive);

  if (activeNotices.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border-y border-amber-200 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 font-bold text-amber-900 flex-shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <div className="flex items-center space-x-1.5 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] sm:text-xs">
            <Bell className="w-3.5 h-3.5 text-amber-800" />
            <span>Notice Alert</span>
          </div>
        </div>

        {/* Notice text display */}
        <div className="flex-1 overflow-hidden">
          <div className="text-amber-950 font-semibold truncate">
            {activeNotices.map((n) => (
              <span key={n.id} className="inline-block mr-6">
                • {n.textEn || n.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
