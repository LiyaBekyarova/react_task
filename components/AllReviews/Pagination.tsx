import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
        gap: '20px',
      }}
    >
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentPage === pageNumber ? '#a0341f' : 'transparent',
              color: currentPage === pageNumber ? '#fff' : '#444',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '400',
            }}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          color: currentPage === totalPages ? '#aaa' : '#444',
        }}
      >
        →
      </button>
    </div>
  );
};
