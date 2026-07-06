import axios from "axios";

export const  baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// token scaduto o revocato: pulisce la sessione locale e riporta al login,
// invece di lasciare l'utente su una pagina "morta" piena di errori.
// Il login stesso è escluso: lì il 401 significa credenziali sbagliate.
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        
        const status = error.response?.status;
        
        const url = error.config?.url || "";
        const isLoginCall = url.includes("/api/auth/login");
        
        const hasSession = !!localStorage.getItem("auth_token");

        if (status === 401 && !isLoginCall && hasSession) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("current_user");
            window.location.assign("/login");
        }

        return Promise.reject(error);
    }
);

export const authConfig = (token) =>({
    headers : {
        Authorization: `Bearer ${token}`
    }
})

export const getToken = () =>{
    // quando l'utente logga conservo il suo token nel local storage
    const token = localStorage.getItem('auth_token') || null;
    return token;
}

