import { createContext, useContext, useReducer } from "react";
import { loginUser, logout } from "@/services/Auth/auth";
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
        alertMessage = msgFromServer || "Credenziali non valide. Riprova.";
        break;
      case 500:
        alertMessage = "Errore del server. Riprova più tardi.";
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
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        } finally {
            // anche se la chiamata fallisce (es. token già scaduto) la sessione
            // locale va comunque chiusa, altrimenti l'utente resta bloccato
            dispatch({type:'LOGOUT'})
            localStorage.removeItem("current_user");
            localStorage.removeItem("auth_token");
        }
    }



    // Sincronizza l'utente aggiornato con lo stato globale e il localStorage
    const syncCurrentUser = (updatedUser) => {
      localStorage.setItem("current_user", JSON.stringify(updatedUser));
      dispatch({type:'SYNC_CURRENT_USER', payload: updatedUser});
    }

    // sostituisce il token corrente (es. dopo un cambio password: il vecchio
    // token diventerebbe "stale" al prossimo giro, questo evita di disconnettere
    // la sessione che ha appena fatto il cambio)
    const updateToken = (newToken) => {
      localStorage.setItem("auth_token", newToken);
      dispatch({type:'UPDATE_TOKEN', payload: newToken});
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
            syncCurrentUser,
            updateToken
        }}>
            {children}
        </AuthContext.Provider>
    )
}
    

export const useAuthContext = () => useContext(AuthContext);

