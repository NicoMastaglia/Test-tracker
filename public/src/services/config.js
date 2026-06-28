
export const  baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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

