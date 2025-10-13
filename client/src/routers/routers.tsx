import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProjectManager from "../layouts/ProjectsLayout";
import ProjectDeail from "../pages/ProjectDetail/ProjectsDetail";
import ProjectsHome from "../pages/Projects/ProjectHome";
import MyTasks from "../pages/Tasks/MyTasks";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/projects",
    element: <ProjectManager />,
    children: [
      { index: true, element: <ProjectsHome /> },
      { path: "detailProject/:id", element: <ProjectDeail /> },
      { path: "myTask", element: <MyTasks />},
    ],
  },
]);
