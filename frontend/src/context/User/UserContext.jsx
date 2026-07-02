import { createContext, useContext, useReducer } from "react";

import { initialState, userReducer } from "./UserReducer";
import { getToken } from "@/services/config";
import {
  // user normale
  getCurrentUser,
  updateCurrentUser,
  updateCurrentUserPassword,
  // admin / superadmin
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserRoleById,
  updateUserPasswordById,
  getUserRelations,
} from "@/services/User/user";
import { useAuthContext } from "@/context/Auth/AuthContext";
const UserContext = createContext();
 

export const UserProvider = ({ children }) => {

  const [state, dispatch] = useReducer(userReducer, initialState)
  const { user: currentAuthUser, syncCurrentUser } = useAuthContext();


  // ── UTENTE NORMALE (/me) 

  const fetchCurrentUser = async () => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      const data = await getCurrentUser(token)
      dispatch({ type: 'SET_SELECTED_USER', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const updateMyProfile = async (userData) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      const data = await updateCurrentUser(token, userData)

      // in atessa che la res di login passi con i campi in ita
      const userToSync ={
        id: currentAuthUser?.id,
        name: userData.name || userData.nome,
        surname: userData.surname || userData.cognome ,
        email: userData.email,
        role:  currentAuthUser?.role || userData.role ,
      }
    
     
      await fetchUsers()
      syncCurrentUser(userToSync)
      return data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const changeMyPassword = async (currentPassword, newPassword) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      const data = await updateCurrentUserPassword(token, currentPassword, newPassword)
      dispatch({ type: 'SET_LOADING' })
      return data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }


  // ── ADMIN / SUPERADMIN (/{id})

  const fetchUsers = async () => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      const data = await getUsers(token)
      dispatch({ type: 'SET_USERS', payload: data })
    } catch (error) {
      console.error("Errore durante il fetch degli utenti:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const fetchUserById = async (user_id) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      const data = await getUserById(token, user_id)
      dispatch({ type: 'SET_SELECTED_USER', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  // niente dispatch: dato di sola lettura per la pagina di dettaglio utente,
  // non deve toccare selectedUser (usato dalla modale di modifica)
  const fetchUserRelations = async (user_id) => {
    const token = getToken()
    return getUserRelations(token, user_id)
  }

  const editUser = async (user_id, userData) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      await updateUserById(token, user_id, userData)

      // merge con la riga esistente: userData ha solo name/surname/email (niente id/role),
      // un dispatch con quell'oggetto "nudo" sovrascriverebbe (non aggiornerebbe) la voce in
      // state.users perdendo il ruolo. Manteniamo id/role e normalizziamo ai campi ita usati altrove.
      const existingUser = state.users.find((u) => u.id === user_id) || {}
      const updatedUser = {
        ...existingUser,
        id: user_id,
        nome: userData.name,
        cognome: userData.surname,
        email: userData.email,
      }
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })

      // se modifico l'utente loggato, sincronizzo AuthContext facendo merge (non sovrascrivendo):
      // currentAuthUser usa id/role che vanno preservati, altrimenti ProtectedRoute perde il ruolo
      // e reindirizza a una dashboard che non sa più quale renderizzare (schermata bianca).
      if (currentAuthUser?.id === user_id) {
        syncCurrentUser({
          ...currentAuthUser,
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
        })
      }
      await fetchUsers()
      return userData
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const removeUser = async (user_id) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      await deleteUserById(token, user_id)
      dispatch({ type: 'DELETE_USER', payload: user_id })
      await fetchUsers()

      if (currentAuthUser?.id === user_id) {
        localStorage.removeItem("current_user");
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const changeUserRole = async (user_id, role) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      await updateUserRoleById(token, user_id, role)

      const currentUser = state.users.find((user) => user.id === user_id) || state.selectedUser || {}
      const updatedUser = {
        ...currentUser,
        id: user_id,
        role,
      }

      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
      if (currentAuthUser?.id === user_id) {
        syncCurrentUser(updatedUser)
      }
      await fetchUsers()
      return updatedUser
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const changeUserPasswordById = async (user_id, newPassword) => {
    dispatch({ type: 'SET_LOADING' })
    try {
      const token = getToken()
      const data = await updateUserPasswordById(token, user_id, newPassword)
      dispatch({ type: 'SET_LOADING' })
      return data
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const clearSelectedUser = () => {
    dispatch({ type: 'CLEAR_SELECTED_USER' })
  }

   


  return (
    <UserContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        error: state.error,
        dispatch,
        // utente normale
        fetchCurrentUser,
        updateMyProfile,
        changeMyPassword,
        // admin / superadmin
        fetchUsers,
        fetchUserById,
        fetchUserRelations,
        selectedUser: state.selectedUser,
        updateUser: editUser,
        deleteUser: removeUser,
        changeUserRole,
        changeUserPasswordById,
        clearSelectedUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
