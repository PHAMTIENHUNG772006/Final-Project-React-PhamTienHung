interface PaginationProps {// lấy danh sách để thực hiện phân trang
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
  const totalPages = Math.ceil(totalItems / itemsPerPage); // lấy ra tổng số trang hiện tại đã chia theo số lượng bản ghi ở trong đó

  if (totalPages <= 1) return null; // ẩn nếu như chỉ có duy nhất một trang

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}// giảm giá trị di 1
        disabled={currentPage === 1}// khi trang hiện tại là trang đầu tiên thì không cho tiếp tục bấm
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
          onClick={() => onPageChange(index + 1)}// index là một số nhỏ hơn 1 nên cộng  vào để lấy ra các giá trị thực
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
        onClick={() => onPageChange(currentPage + 1)}// tăng giá trị lên 1
        disabled={currentPage === totalPages}// khi trang hiện tại là trang cuối cùng thì không cho tiếp tục bấm
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
