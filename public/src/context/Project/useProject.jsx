import {useReducer,useEffect} from 'react';



const initialState = {
    projects:  [],
    loading : false,
    error : null,
    selectedProject : null
}



export const projectReducer = (state,action) =>{

    switch(action.type){
        case "ADD_PROJECT":
            const newProjects = [...state.projects,action.payload];
            
            return { ...state, projects: newProjects };

        case "UPDATE_PROJECT" : 
            const updatedProjects = state.projects.map(p=> p.id === action.payload.id ? action.payload : p);
           
            return { ...state, projects: updatedProjects };

        case "DELETE_PROJECT" : 
            const filteredProjects = state.projects.filter(p=> p.id !== action.payload);
         
            return { ...state, projects: filteredProjects };

        default: 
            return state;

    }

}

// export const useProject = () =>{

//     const [state,dispatch] = useReducer(projectReducer,initialState)

//     const addProject = (project) => {
//         dispatch({ type: "ADD_PROJECT", payload: project });
//     };

//     const updateProject = (project) => {
//         dispatch({ type: "UPDATE_PROJECT", payload: project });
//     };

//     const deleteProject = (projectId) => {
//         dispatch({ type: "DELETE_PROJECT", payload: projectId });
//     };

//     return { state, addProject, updateProject, deleteProject };
// }
