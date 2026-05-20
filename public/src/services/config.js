
export const  baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const authConfig = (token) =>({
    headers : {
        Authorization: `Bearer ${token}`
    }
})

export const getToken = () =>{
    // Auth token is stored as a plain string under 'auth_token'
    const token = localStorage.getItem('auth_token') || null;
    return token;
}