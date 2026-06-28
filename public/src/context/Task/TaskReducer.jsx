/*

*/




export const initialState = {

    assignedTasks: [], // tasks assegnati all'utente loggato
    loading: false,
    error: null




}


export const taskReducer = (state, action) => {

    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true, error: null };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }; 
        
        case  'SET_ASSIGNED_TASKS':
            return { ...state, assignedTasks: action.payload, loading: false };

        default:
            return state;

    }



}