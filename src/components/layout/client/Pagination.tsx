"use client"
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="bg-blue-500 dark:bg-blue-800 text-white"
      >
        Trước
      </Button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          variant={currentPage === pageNum ? "default" : "outline"}
          className={`${
            currentPage === pageNum 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-500 dark:bg-blue-800 text-white'
          }`}
        >
          {pageNum}
        </Button>
      ))}
      
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        className="bg-blue-500 dark:bg-blue-800 text-white"
      >
        Tiếp
      </Button>
    </div>
  );
} 