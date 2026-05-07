import {createContext,useContext} from 'react'
import { useProject } from './useProject';

const ProjectContext = createContext();


export const ProjectProvider = ({children}) =>{
     // prendo projects ma questo è un oggetto con dentro anche le funzioni, non solo un array di progetti
     // devpo fare in modo che il context fornisca solo l'array di progetti, non tutte le funzioni
     // devo passare i singoli valori, non tutto lo state

     const {state,addProject,updateProject,deleteProject} = useProject();
   

    return(
        <ProjectContext.Provider value={{projects: state.projects,addProject,updateProject,deleteProject}}>
            {children}
        </ProjectContext.Provider>
    )
}

export const useProjectContext = () => useContext(ProjectContext);