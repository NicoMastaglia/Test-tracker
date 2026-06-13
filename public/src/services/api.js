import axios from 'axios'; 
 
const API_URL = 'http://localhost:3000';
// da aggiungere token nel header dove necessario 
// es login e register non ne hanno bisogno











export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const logout =  async (token) => {
  try {
    await axios.post(`${API_URL}/api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    throw error;
  }
  
};


export const register = async (name,surname, email, password, role,token) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, { name, surname, email, password, role },{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
        );
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


