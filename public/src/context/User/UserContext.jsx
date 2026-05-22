import { createContext,
    useContext,useReducer
 } from "react";


import { initialState,userReducer } from "./useUser";
import { getToken } from "@/services/config";
import { getUsers,updateUserById,deleteUserById,getUserById,updateUserRoleById } from "@/services/User/user";
import { useAuth } from "@/context/Auth/AuthContext";
const UserContext = createContext(); 


export const UserProvider = ({children}) =>{

  const [state,dispatch] = useReducer(userReducer,initialState)
  const { user: currentAuthUser, syncCurrentUser } = useAuth();

    
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
      await updateUserById(token,user_id,userData)

      const currentUser = state.users.find((user) => user.id === user_id) || state.selectedUser || {}
      const updatedUser = {
        ...currentUser,
        id: user_id,
        name: userData.name ?? userData.nome ?? currentUser.name ?? currentUser.nome ?? "",
        surname: userData.surname ?? userData.cognome ?? currentUser.surname ?? currentUser.cognome ?? "",
        email: userData.email ?? currentUser.email ?? "",
        nome: userData.name ?? userData.nome ?? currentUser.name ?? currentUser.nome ?? "",
        cognome: userData.surname ?? userData.cognome ?? currentUser.surname ?? currentUser.cognome ?? "",
      }

      dispatch({type:'UPDATE_USER',payload:updatedUser})
        if (currentAuthUser?.id === user_id) {
          syncCurrentUser(updatedUser)
        }
        await fetchUsers()
      return updatedUser
    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
      throw error
    }
  }

  const removeUser = async (user_id) =>{
    dispatch({type:'SET_LOADING'})
    try{
        const token = getToken()
         await deleteUserById(token,user_id)
        dispatch({type:'DELETE_USER',payload:user_id})
        await fetchUsers()

        if (currentAuthUser?.id === user_id) {
          localStorage.removeItem("current_user");
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }
    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
  }


  const changeUserRole  = async (user_id,role) =>{
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
      await updateUserRoleById(token,user_id,role)

      const currentUser = state.users.find((user) => user.id === user_id) || state.selectedUser || {}
      const updatedUser = {
        ...currentUser,
        id: user_id,
        role,
      }

      dispatch({type:'UPDATE_USER',payload:updatedUser})
      if (currentAuthUser?.id === user_id) {
        syncCurrentUser(updatedUser)
      }
      await fetchUsers()
      return updatedUser

    }catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
      throw error
    }
    }

     

    const clearSelectedUser = () => {
        dispatch({
         type:'CLEAR_SELECTED_USER'
        })
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
        changeUserRole:changeUserRole,
        clearSelectedUser:clearSelectedUser
    }}
    >
        {children }
    </UserContext.Provider>
  
  )
}

export const useUsersContext  =() =>useContext(UserContext)