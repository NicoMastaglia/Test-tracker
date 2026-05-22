


export const initialState = {
   user: JSON.parse(localStorage.getItem("current_user")) || null,
   token: localStorage.getItem("auth_token") || null,
   isAuthenticated: !!localStorage.getItem("auth_token"),
   loading: false,
   error: null
}



export const authReducer = (state, action) => {

   switch(action.type){

      case 'LOGIN_START':
         return {
            ...state,
            loading:true,
            error:null
         };

      case 'LOGIN_SUCCESS':
         return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated:true,
            loading:false,
            error:null
         };

      case 'LOGIN_FAILURE':
         return {
            ...state,
            user:null,
            token:null,
            isAuthenticated:false,
            loading:false,
            error:action.payload
         };

      case 'LOGOUT':
         return {
            ...state,
            user:null,
            token:null,
            isAuthenticated:false,
            loading:false,
            error:null
         };

      case 'SYNC_CURRENT_USER':
         return {
            ...state,
            user: action.payload,
            loading: false,
            error: null
         };

         case 'LOGOUT_FAILURE':
            return {
               ...state,
               error: action.payload
            }
        
        // case 'REGISTER_START':
        //     return {
        //        ...state,
        //        loading:true,
        //        error:null
        //     };

        // case 'REGISTER_SUCCESS': 
        //     return {
        //        ...state,
        //        loading:false,
        //        error:null
        //     };
        
        // case 'REGISTER_FAILURE':
        //     return {
        //        ...state,
        //        loading:false,
        //        error: action.payload
        //     };

      default:
         return state;
   }
}
