import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProjectManager from "./layouts/ProjectsLayout";
import ProjectDeail from "./pages/ProjectDetail/ProjectsDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang danh sách */}
        <Route path="/projects" element={<ProjectManager />} />

        {/* Trang chi tiết */}
        <Route path="/projects/detailProject/:id" element={<ProjectDeail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
