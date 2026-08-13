import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchMemoriesProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CATEGORIES = [
  { id: 'ALL', label: 'ALL' },
  { id: '90s', label: '90s' },
  { id: '80s', label: '80s' },
  { id: 'LOVE', label: 'LOVE' },
  { id: 'CHILDHOOD', label: 'CHILDHOOD' },
  { id: 'MONSOON', label: 'MONSOON' },
  { id: 'SAD', label: 'SAD' },
];

export const SearchMemories: React.FC<SearchMemoriesProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 select-none">
      {/* 1. Vintage Search Field */}
      <div className="relative flex-1 max-w-md">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#C88A3D] pointer-events-none" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#26150F]/90 border border-[#C88A3D]/40 rounded-sm text-[#F1D7A3] placeholder-[#F1D7A3]/50 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#E5AD54] transition-colors shadow-inner"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-[#F1D7A3]/60 hover:text-[#F1D7A3] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Vintage Category Filter (Subtle Vintage Underline / Painted Highlight) */}
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-2.5 py-1 text-xs font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'text-[#F1D7A3] font-bold'
                  : 'text-[#F1D7A3]/60 hover:text-[#F1D7A3]'
              }`}
            >
              <span>{cat.label}</span>

              {/* Subtle Painted Terracotta Underline */}
              {isActive && (
                <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#B9472F] shadow-[0_0_6px_#B9472F] rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
