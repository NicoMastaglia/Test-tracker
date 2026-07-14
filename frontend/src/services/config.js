import axios from "axios";

// CONFIG CHIAMATE API 
// uso VITE_BACKEND_URL o localhost:3000 se non definito
export const  baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";


// INTERCEPTOR : serve a 'intercettare' le risposte delle chiamate axios
//  gestice  il caso di token scaduto o non valido (401 Unauthorized) 
// e reindirizzare l'utente alla pagina di login

axios.interceptors.response.use(
    //  risposta positiva (200) => ritorna la response
    (response) => response,
    // risposta negativa (401) => logout automatico e redirect pagina login
    (error) => {
        

        // prendo  lo status della res 
        // es  : 401 
        const status = error.response?.status;
        
        // prendo url della chiamata
        const url = error.config?.url || "";

        // verifico se la chiamata è quella di login
        // se è una chiamata di login non faccio logout automatico
        const isLoginCall = url.includes("/api/auth/login"); // true (login) o false (altre chiamate)
        

        //verifico se c'è un token nello storage 
        const hasSession = !!localStorage.getItem("auth_token"); // true (token presente) o false (token assente)


        // se unauthorized && non è una chiamata di login &&  c'è un token nello storage 
        // => logout automatico e redirect pagina login 
        if (status === 401 && !isLoginCall && hasSession) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("current_user");
            window.location.assign("/login");
        }
        
        // ritorno l'error 
        return Promise.reject(error);
    }
);


// Helper per configurazione header con token 
export const authConfig = (token) =>({
    headers : {
        Authorization: `Bearer ${token}`
    }
})


// recupera il token dallo storage ,se presente 
export const getToken = () =>{
    // quando l'utente logga conservo il suo token nel local storage
    const token = localStorage.getItem('auth_token') || null;
    return token;
}

