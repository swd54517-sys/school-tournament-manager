import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showLabel = true }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">進度</span>
        {showLabel && <span className="text-sm font-medium text-gray-700">{current}/{total}</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary-600 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
