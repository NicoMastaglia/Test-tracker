import {createContext,useContext} from 'react'
import { useProject } from './useProject';

const ProjectContext = createContext();


export const ProjectProvider = ({children}) =>{
   
     const {state,addProject,updateProject,deleteProject} = useProject();
   

    return(
        <ProjectContext.Provider value={{projects: state.projects,addProject,updateProject,deleteProject}}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProjectContext = () => useContext(ProjectContext);