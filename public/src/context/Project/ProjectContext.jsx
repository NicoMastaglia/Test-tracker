import { createContext, useContext, useReducer } from "react";
import { initialState, projectReducer } from "./ProjectReducer";

import { getToken } from "@/services/config";
import { getProjects,createProject,
    getProjectById,updateProject as updateProjectApi,deleteProject as
     deleteProjectApi,updateProjectStatus as
      updateProjectStatusApi,assignUserToProject as 
    assignUserToProjectApi,unAssingUserAssignment as unAssingUserAssignmentApi,
  getProjectUsers as getProjectUsersApi }
 from "@/services/Project/project";

const ProjectContext = createContext();


export const ProjectProvider = ({ children }) => {

    const [state, dispatch] = useReducer(projectReducer, initialState)


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
            return newProject
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }

    }

    const fetchProjectDetails = async (projectId) => {
        dispatch({type:'SET_LOADING'})
        try{
            const token = getToken()
            const projectDetails = await getProjectById(token, projectId)
            console.log(projectDetails)
           
            dispatch({type:'SET_SELECTED_PROJECT', payload:  projectDetails})
            // dispatch({type:'SET_SELECTED_PROJECT', payload: projectDetails})
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
        }
    }

    const updateProject = async (projectId, projectData) => {
        dispatch({type:'SET_LOADING'})
        try {
            const token = getToken()
            const updatedProject = await updateProjectApi(token, projectId, projectData)
            dispatch({type:'UPDATE_PROJECT', payload: updatedProject})
            return updatedProject
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }
    }

    const deleteProject = async (projectId) => {
        dispatch({type:'SET_LOADING'})
        try {
            const token = getToken()
            await deleteProjectApi(token, projectId)
            dispatch({type:'DELETE_PROJECT', payload: projectId})
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }
    }
    


    const updateProjectStatus = async (projectId, status) => {
        dispatch({type:'SET_LOADING'})
        try {
            const token = getToken()
            const updatedProject = await updateProjectStatusApi(token, projectId, status)
            dispatch({type:'UPDATE_PROJECT', payload: updatedProject})
            return updatedProject
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }
    }

    const assignUserToProject = async (projectId, userId) => {
        dispatch({type:'SET_LOADING'})
        try {
            const token = getToken()
            await assignUserToProjectApi(token, projectId, userId)

            // rinfresco la lista progetti e, se è quello aperto, i suoi dettagli
            // (che includono user_list, la fonte unica degli assegnati)
            await fetchProjects()
            if (state.selectedProject && Number(state.selectedProject.id) === Number(projectId)) {
                await fetchProjectDetails(projectId)
            }

            return { projectId, userId }
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }
    }

    const unAssingUserAssignment = async (projectId, userId) => {
        dispatch({type:'SET_LOADING'})
        try {
            const token = getToken()
            await unAssingUserAssignmentApi(token, projectId, userId)

            // rinfresco la lista progetti e, se è quello aperto, i suoi dettagli
            await fetchProjects()
            if (state.selectedProject && Number(state.selectedProject.id) === Number(projectId)) {
                await fetchProjectDetails(projectId)
            }

            return { projectId, userId }
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }
    }


    const getProjectUsers = async (projectId) => {
        dispatch({type:'SET_LOADING'})
        try {
            const token = getToken()
            const users = await getProjectUsersApi(token, projectId)
            return users
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error
        }
    }

    const clearSelectedProject = () => {
     dispatch({
      type:'CLEAR_SELECTED_PROJECT'
    })
       }

    
    return (
        <ProjectContext.Provider value={{
         error: state.error,
         loading: state.loading,
         projects : state.projects,
         selectedProject: state.selectedProject,
         fetchProjects:fetchProjects,
            addProject:addProject,
            fetchProjectDetails:fetchProjectDetails,
            updateProject:updateProject,
            deleteProject:deleteProject,
            updateProjectStatus:updateProjectStatus,
            assignUserToProject:assignUserToProject,
            unAssingUserAssignment:unAssingUserAssignment,
            clearSelectedProject:clearSelectedProject,
            getProjectUsers:getProjectUsers




        }}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjectContext = () => useContext(ProjectContext)