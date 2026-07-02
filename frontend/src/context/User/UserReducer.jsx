


export const initialState = {
    users :  [],
    loading : false,
    error : null,
    selectedUser : null,

}


export const userReducer = (state,action) =>{
    switch(action.type){


        case 'SET_SELECTED_USER':
           return {
              ...state,
            selectedUser: action.payload,
            loading:false
         };

        case 'CLEAR_SELECTED_USER':
            return {
                ...state,
                selectedUser: null
            }

        case 'SET_LOADING':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'SET_USERS':
            return {
                ...state,
                users:action.payload,
                loading:false,
            }

        case 'ADD_USER':
            return {
                ...state,
                users: [...state.users, action.payload],
                loading: false
            };
        case 'UPDATE_USER': 
            return {
                ...state,
                users: state.users.map(u=>u.id== action.payload.id ? action.payload : u),
                loading:false
            }

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case 'DELETE_USER': 
            return {
                ...state,
                users: state.users.filter(u=>u.id !==action.payload),
                loading:false
            }
        
        
        default: 
            return state;

        

    }

}