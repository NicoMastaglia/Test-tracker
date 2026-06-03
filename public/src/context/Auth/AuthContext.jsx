import { createContext, useContext, useReducer } from "react";
import { loginUser, logout } from "@/services/api";
import { initialState, authReducer } from "./AuthReducer";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


    const [state,dispatch] = useReducer(authReducer,initialState)


    const login =async (email,password) =>{

        dispatch({type:'LOGIN_START'})



        try{
            const response = await loginUser(email,password);
            localStorage.setItem("current_user",JSON.stringify(response.user));
            localStorage.setItem("auth_token",response.token);

            dispatch({type:'LOGIN_SUCCESS', payload: response})
          
            console.log("Login effettuato con successo:", response);
            // toast.success("Login effettuato con successo!");

            //    return true;
               return {success:true, message:"Login effettuato con successo!"}
        }
        catch(error){

              let alertMessage = "Si è verificato un errore imprevisto.";

             

              const status = error.response ? error.response.status : null;
              const msgFromServer = error.response?.data?.message;
  


    

  

    switch (status) {
      case 400:
        alertMessage = "Email e password sono obbligatori.";
        
        break;
      case 401:
        alertMessage = "Password non valida. Riprova."
        
        
        break;
      case 404:
        alertMessage = "Utente non trovato. Controlla l'email.";
        
        break;
      case 500:
        alertMessage = "Errore del server. Riprova più tardi.";
        console.log(2)
        
        break;
      default:
        // Se il server non risponde o c'è un errore di rete
        alertMessage = msgFromServer || "Impossibile connettersi al server.";
        
    }

    dispatch({type:'LOGIN_FAILURE', payload: alertMessage})

    // console.error(`Login failed [${status}]:`, error.response?.data || error.message);
    // toast.error(alertMessage);
    // return false;
    return {success:false, message: alertMessage}

        
 
    }
    }

    const logoutUser = async (token) => {
        try {
            await logout(token);
            dispatch({type:'LOGOUT'})
            localStorage.removeItem("current_user");
            localStorage.removeItem("auth_token");
            // toast.success("Logout effettuato con successo!");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
            // toast.error("Si è verificato un errore durante il logout. Riprova.");
        }
    }



    // Sincronizza l'utente aggiornato con lo stato globale e il localStorage
    const syncCurrentUser = (updatedUser) => {
      localStorage.setItem("current_user", JSON.stringify(updatedUser));
      dispatch({type:'SYNC_CURRENT_USER', payload: updatedUser});
    }


    return (
        <AuthContext.Provider value={{
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            error: state.error,
            login,
            logoutUser,
            syncCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}
    

export const useAuthContext = () => useContext(AuthContext);

