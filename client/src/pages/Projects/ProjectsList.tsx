import { Space, Table } from "antd";
import type Project from "../../interfaces/interface";
import { useNavigate } from "react-router-dom";
import {  useState } from "react";
import Pagination from "./Pagination";

const { Column } = Table;

interface ProjectsListProps {
  projects: Project[];
  showModalDelete: (project: Project) => void;
  showModalEdit: (project: Project) => void;
}

export default function ProjectsList({
  showModalDelete,
  projects,
  showModalEdit,
}: ProjectsListProps) {
  // đây là chỗ lấy project theo các dự án của owner đang đăng nhập

  const navigate = useNavigate();
  const handleDetail = (id: string) => {
    navigate(`/projects/detailProject/${id}`);
  };

  const handleDelete = (project: Project) => {
    showModalDelete(project);
  };
  const handleEdit = (project: Project) => {
    showModalEdit(project);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="table-container">
      <Table<Project>
        className="custom-table"
        dataSource={currentProjects}
        rowKey="id"
        pagination={false}
      >
        <Column<Project>
          title="ID"
          key="stt"
          render={(_, __, index) => startIndex + index + 1}
        />
        <Column<Project>
          title="Tên dự án"
          dataIndex="projectName"
          className="nameProject"
          key="projectName"
        />
        <Column<Project>
          title="Hành động"
          key="action"
          render={(record: Project) => (
            <Space size="middle">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(record)}
              >
                Sửa
              </button>

              <button
                className="btn btn-delete"
                onClick={() => handleDelete(record)}
              >
                Xoá
              </button>
              <button
                className="btn link-detail"
                onClick={() => handleDetail(record.id)}
              >
                Chi tiết
              </button>
            </Space>
          )}
        />
      </Table>
      <Pagination
        currentPage={currentPage}
        totalItems={projects.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      ></Pagination>
    </div>
  );
}
