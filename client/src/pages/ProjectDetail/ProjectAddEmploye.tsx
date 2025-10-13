import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/stores";
import { useEffect } from "react";
import { featchProjects } from "../../redux/slices/ProjectSlice";

interface ProjectDeailContext {
  showAddModal: () => void;
  showAddModalEmp: () => void;
  showListEmp: () => void;
  onSearch: (keyWord :string) => void;
  onSort: (value : string) => void;
}

export default function ProjectAddEmploye({
  showAddModal,
  showAddModalEmp,
  showListEmp,
  onSearch,     
  onSort
}: ProjectDeailContext) {
  // lấy hiển thị ra tên,image,decription, chủ dự án
  const { id } = useParams<{ id: string }>();
  const users = useSelector((state: RootState) => state.users.users);
  const projects = useSelector((state: RootState) => state.projects.projects);


  const findProject = projects.find((p) => p.id === String(id));
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(featchProjects());
  }, [dispatch, id]);

  if (!findProject) return null;
  const members = findProject.members ?? [];


  const visibleMembers = members.slice(0, 2);

const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
  onSort(e.target.value);
};

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  onSearch(e.target.value);
};


  return (
    <div>
      <div className="header-main">
        <div className="header-left-main">
          <h2 className="name-Project">{findProject.projectName}</h2>
          <div className="decription-image">
            <img
              className="image-project"
              src={findProject.image}
              alt="avatar"
            />

            <p className="describe" id="describe">
              {findProject.description}
            </p>
          </div>
          <div>
            <button
              onClick={showAddModal}
              className="btnAddTask"
              id="btnAddTask"
            >
              + Thêm nhiệm vụ
            </button>
          </div>
        </div>
        <div className="header-right-main">
          <div className="employeeManager">
            <div className="addTask">
              <h2>Thành viên</h2>
              <button
                onClick={() => {
                  showAddModalEmp();
                }}
                className="btnAddEmployee"
                id="btnAddEmployee"
              >
                + Thêm thành viên
              </button>
            </div>
            <div className="tag">
              {visibleMembers.map((member) => {
                const user = users.find((u) => u.id === member.userId);
                if (!user) return null;

                return (
                  <div className="box" key={member.userId}>
                    <img
                      className="logoName"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.fullname
                      )}&background=0D8ABC&color=fff&size=128&bold=true`}
                      alt={user.fullname}
                    />
                    <div className="box-name">
                      <p id="name">{user.fullname}</p>
                      <p className="role">{member.role}</p>
                    </div>
                  </div>
                );
              })}

              <div className="box" id="listLogoEmployee">
                <div className="box-name">
                  <p id="nameEmployee"></p>
                  <p className="role" id="roleEmployee"></p>
                </div>
              </div>
             
                <div
                  className="menu"
                  onClick={showListEmp}
                  id="menuEmployee"
                >
                  ...
                </div>

            </div>
          </div>
          <div className="sortFilter">
            <select onChange={handleSort} name="" id="sortFilter">
                <option value="">Sắp xếp theo</option>
              <option value="deadline">Sắp xếp theo hạn chót</option>
              <option value="priority">Sắp xếp theo độ ưu tiên</option>
            </select>
            <input
            onChange={handleSearch}
              id="inputSearch"
              type="text"
              placeholder="Tìm kiếm nhiện vụ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
