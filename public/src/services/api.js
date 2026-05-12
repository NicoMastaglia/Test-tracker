import axios from 'axios'; 

const API_URL = 'http://localhost:3000';
// da aggiungere token nel header dove necessario 
// es login e register non ne hanno bisogno


export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/api/users`);
  return response.data;
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user_test");
};


export const register = async (name,surname, email, password, role) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, { name, surname, email, password, role });
        return response.data;

    }
    catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;
    }



}
export const getCurrentUser = () => {
  const user = localStorage.getItem("user_test");
  return user ? JSON.parse(user) : null;
}


