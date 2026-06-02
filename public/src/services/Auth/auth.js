import {baseUrl, authConfig} from '../config';


export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
    
        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};

export const logout =  async (token) => {
    try {
        await axios.post(`${baseUrl}/api/auth/logout`, {}, authConfig(token));
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        throw error;
    }
};

export const register = async (name,surname, email, password, role,token) => {
    try {
        const response = await axios.post(`${baseUrl}/api/auth/register`, { name, surname, email, password, role }, authConfig(token));
        return response.data;
    }
    catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;
    }
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user_test");
    return user ? JSON.parse(user) : null;
}