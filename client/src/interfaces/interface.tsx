export interface User {
    id : string;
    fullname : string;
    email : string;
    password : string;
}

export interface Task {
  id: string;
  taskName: string;
  assigneeId: string;  
  projectId: string;    
  asigndate: string;    
  dueDate: string;   
  priority: "Thấp" | "Trung bình" | "Cao";   
  progress: string;     
  status: "To do" | "In Progress" | "Pending" | "Done"; 
}

export interface ProjectMember {
  userId: string;
  role: string;  
}

export default interface Project {
  id: string;
  idOwner: string;
  projectName: string;
  description: string;
  image: string;     
  members: ProjectMember[];
}
