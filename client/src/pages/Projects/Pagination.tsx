interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img
          className="icon-left"
          src="../../src/assets/icons/Chevron_Left_MD.png"
          alt="Previous"
        />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <span
          key={index}
          onClick={() => onPageChange(index + 1)}
          style={{
            cursor: "pointer",
            fontWeight: currentPage === index + 1 ? "bold" : "normal",
            backgroundColor: currentPage === index + 1 ? "#0d6efd" : "transparent",
            color: currentPage === index + 1 ? "#fff" : "#000",
            padding: "4px 10px",
            borderRadius: "4px",
            margin: "0 2px",
            border: "1px solid #ffff"
          }}
        >
          {index + 1}
        </span>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img
          className=" icon-right"
          src="../../src/assets/icons/chevron_right.png"
          alt="Next"
        />
      </button>
    </div>
  );
}
