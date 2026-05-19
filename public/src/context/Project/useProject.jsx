



export const initialState = {
    projects:  [],
    loading : false,
    error : null,
    selectedProject : null
}

export const projectReducer = (state,action) =>{
    switch(action.type){
        case 'SET_SELECTED_PROJECT':
            return {
                ...state,
                selectedProject: action.payload,
                loading:false
            }
        case 'CLEAR_SELECTED_PROJECT': 
            return {
                ...state,
                selectedProject: null

            }
        case 'SET_LOADING': 
            return {
                ...state,
                loading: true,
                error: null

            }
        
        case 'SET_ERROR': 

            return {
                ...state,
                error: action.payload,
                loading : false 
            }
        case 'SET_PROJECTS':
            return {
                ...state,
                projects: action.payload,
                loading: false
            }
        case 'ADD_PROJECT' : 
            return {
                ...state,
                projects: [...state.projects, action.payload],
                loading: false 
            }
        
        default: 
            return state 
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
