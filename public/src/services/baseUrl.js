
export const  baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const authConfig = (token) =>({
    headers : {
        Authorization: `Bearer ${token}`
    }
})

export const getToken = () =>{
    const token = localStorage.getItem('token_test') ? JSON.parse(localStorage.getItem('token_test')) : null;
    return token 
}