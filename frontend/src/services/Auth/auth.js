import axios from 'axios';
import { baseUrl, authConfig } from '../config';

export const loginUser = async (email, password) => {
  const response = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
  return response.data;
};

export const logout = async (token) => {
  const response = await axios.post(`${baseUrl}/api/auth/logout`, {}, authConfig(token));
  return response.data;
};

// solo superadmin: crea un nuovo utente senza password, che la imposta tramite il link di setup ricevuto via email
export const register = async (name, surname, email, role, token) => {
  const response = await axios.post(
    `${baseUrl}/api/auth/register`,
    { name, surname, email, role },
    authConfig(token),
  );
  return response.data;
};

export const setupAccount = async (token, password) => {
  const response = await axios.post(`${baseUrl}/api/auth/setup`, { token, password });
  return response.data;
};

export const verifySetupToken = async (token) => {
  const response = await axios.get(`${baseUrl}/api/auth/verify-setup-token`, { params: { token } });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${baseUrl}/api/auth/forgot-password`, { email });
  return response.data;
};
