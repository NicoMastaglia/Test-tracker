
import { initialState,projectReducer } from "./useProject";
import { useContext,createContext,useReducer } from "react";

import { getToken } from "@/services/config.";
import { getProjects,createProject } from "@/services/Project/project";

const ProjectContext = createContext(); 


export const ProjectProvider = ({ children }) => {

    const [state,dispatch] = useReducer(projectReducer,initialState)


    const fetchProjects  = async () =>{
        dispatch({type:'SET_LOADING'})

        try {
            const token = getToken()
            const projects = await getProjects(token)
            dispatch({type:'SET_PROJECTS', payload: projects})
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
        }
    }

    const addProject = async (projectData) =>{

        dispatch({type:'SET_LOADING'})

        try {
            const token = getToken()
            const newProject = await createProject(token, projectData)
            dispatch({type:'ADD_PROJECT', payload: newProject})
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
        }

    }


    return (
        <ProjectContext.Provider value={{
         error: state.error,
         loading: state.loading,
         projects : state.projects,
         selectedProject: state.selectedProject,
         fetchProjects:fetchProjects,
            addProject:addProject,
         



        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const  useProjectContext = () =>useContext(ProjectContext)