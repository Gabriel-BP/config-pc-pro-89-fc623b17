
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ComponentListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function ComponentListPagination({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage 
}: ComponentListPaginationProps) {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={onPrevPage} 
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        <PaginationItem>
          <span className="px-4 py-2">
            Página {currentPage} de {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext 
            onClick={onNextPage}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
