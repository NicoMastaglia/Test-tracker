


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
                selectedProject: null,
                loading:false

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
        
        case 'DELETE_PROJECT' :
            return {
                ...state,
                projects: state.projects.filter(project => project.id !== action.payload),
                loading: false,
                selectedProject:
                // If the deleted project is currently selected, we clear the selection
              state.selectedProject?.id === action.payload
                ? null
                : state.selectedProject
            }
        case 'UPDATE_PROJECT' :
            return {
                ...state,
                projects: state.projects.map(project => 
                    project.id === action.payload.id ? action.payload : project
                ),
                // If the updated project is currently selected, we update the selectedProject as well
                selectedProject: state.selectedProject && state.selectedProject.id === action.payload.id ? action.payload : state.selectedProject,
                loading: false 
            }
        default: 
            return state 
    }
}