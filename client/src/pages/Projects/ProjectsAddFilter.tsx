interface ModalAddProjectProps {
  showModal: () => void;
  onSearch: (word : string) => void;
}

export default function ProjectsAddFilter({showModal,onSearch} : ModalAddProjectProps) {
  return (
    <div>
      <h2 className="contentHeader">Quản Lý Dự Án Nhóm</h2>
      <div className="addProject">
        <button className="btn btn-addProject" onClick={showModal}>
          Thêm dự án
        </button>
        <input
        onChange={(e) => {onSearch(e.target.value)}}
          className="input"
          id="searchProject"
          type="text"
          placeholder="Tìm kiếm dự án"
        />
      </div>
      <h3 className="listProject">Danh Sách Dự Án</h3>
    </div>
  );
}
