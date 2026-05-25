import AppLayout from "@/Components/layout/AppLayout";
import ProjectTable from "@/Components/features/projects/ProjectTable";
import ActionBar from "@/utils/ActionBar";
import NewProject from "@/Components/features/projects/NewProject";
import React,{useState,useEffect,useMemo} from 'react'
import { useProjectContext } from "@/context/Project/ProjectContext";
import { useUserContext } from "@/context/User/UserContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { Button } from "@/Components/ui/button";
const AdminProjects = () => {
    const {projects,addProject,fetchProjects} = useProjectContext();
    const { users, fetchUsers } = useUserContext();
    const { user } = useAuthContext();
    const [search,setSearch] = useState('')
    const [modalOpen,setModalOpen] = useState(false)
    const [formData,setFormData] = useState({
        name: '',
        description: ''
    });

    
    useEffect(()=>{
        fetchProjects()
        fetchUsers()
    },[])

    const handleAddProject = async () =>{
        if (user?.role !== 'admin') return;

        const newProject = {
            name : formData.name,
            description: formData.description
        }
        await addProject(newProject);
        await fetchProjects();
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
            (project.status ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, projects]);

   

    return (
        <>
        <AppLayout page="projects">
            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <ActionBar
                        search={search}
                        setSearch={setSearch}
                        placeholder="Cerca progetto..."
                        buttonText={user?.role === 'admin' ? 'Add Project' : null}
                        onButtonClick={user?.role === 'admin' ? () => setModalOpen(true) : undefined}
                        buttonVariant="emerald"
                    />
                    <div className="pt-4">
                        <NewProject
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                            handleAddProject={handleAddProject}
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>
                </div>

                <ProjectTable data={filteredProjects} users={users} />
            </div>
        </AppLayout>

        </>
    )
}

export default AdminProjects;