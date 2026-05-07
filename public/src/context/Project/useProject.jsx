import {useReducer,useEffect} from 'react';
import { projects } from '@/fake_data/data';

const getFromStorage = (key,fallback) =>{
    try{
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : fallback;
    }
    catch(error){
        console.error("Errore nel recupero da localStorage:",error);
        return fallback
    }
}


const initialState = {
    projects: getFromStorage("projects_test",projects)
}



const projectReducer = (state,action) =>{

    switch(action.type){
        case "ADD_PROJECT":
            const newProjects = [...state.projects,action.payload];
            // localStorage.setItem("projects_test", JSON.stringify(newProjects));
            return { ...state, projects: newProjects };

        case "UPDATE_PROJECT" : 
            const updatedProjects = state.projects.map(p=> p.id === action.payload.id ? action.payload : p);
            // localStorage.setItem("projects_test", JSON.stringify(updatedProjects));
            return { ...state, projects: updatedProjects };

        case "DELETE_PROJECT" : 
            const filteredProjects = state.projects.filter(p=> p.id !== action.payload);
            // localStorage.setItem("projects_test", JSON.stringify(filteredProjects));
            return { ...state, projects: filteredProjects };

        default: 
            return state;

    }

}

export const useProject = () =>{

    const [state,dispatch] = useReducer(projectReducer,initialState)

    const addProject = (project) => {
        dispatch({ type: "ADD_PROJECT", payload: project });
    };

    const updateProject = (project) => {
        dispatch({ type: "UPDATE_PROJECT", payload: project });
    };

    const deleteProject = (projectId) => {
        dispatch({ type: "DELETE_PROJECT", payload: projectId });
    };

    return { state, addProject, updateProject, deleteProject };
}
