import AppLayout from "@/Components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import ProjectTable from "@/Components/features/projects/ProjectTable";
import ProjectActions from "@/Components/features/projects/ProjectActions";
import ProjectHeader from "@/Components/features/projects/ProjectHeader";
import React,{useState,useEffect,useMemo} from 'react'
import { useProjectContext } from "@/context/Project/ProjectContext";
// import { projects } from "@/fake_data/data";
const AdminProjects = () => {
    const {projects,addProject} = useProjectContext();
    const [search,setSearch] = useState('')
    const [modalOpen,setModalOpen] = useState(false)
    const [formData,setFormData] = useState({
        name: '',
        description: ''
    });
    


    const handleAddProject = () =>{
        const newProject = {
            id: projects.length +1  || 1,
            name : formData.name,
            description: formData.description
        }
        addProject(newProject);
        localStorage.setItem('projects', JSON.stringify([...projects, newProject]));
        setFormData({
            name: '',
            description: ''
        })
        setModalOpen(false)
    }

   const filteredProjects = useMemo(() => {
    if (!search) return projects;
    
    return projects.filter((project) =>
     project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, projects]);

   

    return (
        <AppLayout page="projects">
            <ProjectHeader modalOpen={modalOpen} setModalOpen={setModalOpen} 
                formData={formData} setFormData={setFormData}
                search={search} setSearch={setSearch}
                addProject={handleAddProject}
                
            />
            
            <ProjectTable data = {filteredProjects} />


        </AppLayout>
    )






}

export default AdminProjects;