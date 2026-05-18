import { createContext,
    useContext,useReducer
 } from "react";


import { initialState,userReducer } from "./useUser";
import { getToken } from "@/services/baseUrl";
import { getUsers,updateUserById,deleteUserById,getUserById,updateUserRoleById } from "@/services/User/user";
const UserContext = createContext(); 


export const UserProvider = ({children}) =>{

  const [state,dispatch] = useReducer(userReducer,initialState)

    
  const fetchUsers = async () =>{

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()

        const data =  await getUsers(token)

        dispatch({type:'SET_USERS',payload:data})
    }
    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }



  }


  const  fetchUserById = async (user_id) =>{
    dispatch({type:'SET_LOADING'})

    try {

        const token = getToken()
        const data =  await getUserById(token,user_id)

        dispatch({type:'SET_SELECTED_USER',payload:data})

    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
  }

  const editUser = async (user_id,userData) =>{
    dispatch({type:'SET_LOADING'})
    try {
        const token = getToken()
        const data = await updateUserById(token,user_id,userData)
        dispatch({type:'UPDATE_USER',payload:data})
    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
  }

  const removeUser = async (user_id) =>{
    dispatch({type:'SET_LOADING'})
    try{
        const token = getToken()
         await deleteUserById(token,user_id)
        dispatch({type:'DELETE_USER',payload:user_id})
    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
  }


  const changeUserRole  = async (user_id,role) =>{
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const data = await updateUserRoleById(token,user_id,role)
        dispatch({type:'UPDATE_USER',payload:data})

    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
  }
 
   



  return (
    <UserContext.Provider  
    value={{
        users:state.users,
        loading: state.loading,
        error : state.error,
        dispatch,
        fetchUsers:fetchUsers,
        fetchUserById:fetchUserById,
        selectedUser:state.selectedUser,
        updateUser:editUser,
        deleteUser:removeUser,
        changeUserRole:changeUserRole
    }}
    >
        {children }
    </UserContext.Provider>
  
  )
}

export const useUsersContext  =() =>useContext(UserContext)