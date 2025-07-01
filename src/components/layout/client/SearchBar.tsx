"use client"
import { FileSearch, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  sortOrder: string;
  onSearch: (value: string) => void;
  onSearchSubmit: () => void;
  onSortChange: () => void;
}

export default function SearchBar({
  searchTerm,
  sortOrder,
  onSearch,
  onSearchSubmit,
  onSortChange
}: SearchBarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 flex-1">
        <FileSearch className="text-gray-400 dark:text-white" />
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          className="flex-1 outline-none text-gray-600 dark:bg-blue-500 dark:text-white dark:placeholder-white"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearchSubmit();
            }
          }}
        />
        <Button 
          onClick={onSearchSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>

      <div className="flex items-center space-x-2 cursor-pointer" onClick={onSortChange}>
        <span className="text-gray-600 dark:text-white">
          {sortOrder === 'asc' ? 'Giá tăng dần' : 'Giá giảm dần'}
        </span>
        <ChevronDown
          className={`text-gray-400 dark:text-white transition-transform ${
            sortOrder === 'asc' ? 'rotate-180' : ''
          }`}
        />
      </div>
    </div>
  );
} 