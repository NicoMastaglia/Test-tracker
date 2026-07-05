import axios from 'axios';
import { baseUrl } from './config';

const API_URL = baseUrl;
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


export const register = async (name, surname, email, role, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register`,
      { name, surname, email, role },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error.response?.data || error.message);
    throw error;
  }
};

export const setupAccount = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/setup`, { token, password });
    return response.data;
  } catch (error) {
    console.error("Setup failed:", error.response?.data || error.message);
    throw error;
  }
};
export const verifySetupToken = async (token) => {
  const response = await axios.get(`${API_URL}/api/auth/verify-setup-token`, { params: { token } });
  return response.data;
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("current_user");
  return user ? JSON.parse(user) : null;
}


