import axios from 'axios';
import { baseUrl, authConfig } from '../config';



// POST LOGIN 
export const loginUser = async (email, password) => {
  const response = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
  return response.data;
};

// POST LOGOUT 
// nota :  {} = body vuoto come 2nd el così il 3rd è authConfig(token) passa come header e non come body 
export const logout = async (token) => {
  const response = await axios.post(`${baseUrl}/api/auth/logout`, {}, authConfig(token));
  return response.data;
};


// POST REGISTER NUOVA UTENZA 
//  SOLO SUPERADMIN CREARE  NUOVI UTENTI 
export const register = async (name, surname, email, role, token) => {
  const response = await axios.post(
    `${baseUrl}/api/auth/register`,
    { name, surname, email, role },
    authConfig(token),
  );
  return response.data;
};


// POST SETUP ACCOUNT
// configurazione account iniziale, senza autenticazione, 
// il token è quello ricevuto via email per setup account
export const setupAccount = async (token, password) => {
  const response = await axios.post(`${baseUrl}/api/auth/setup`, { token, password });
  return response.data;
};


// GET PER VERIFICA VALIDITà TOKEN
// token ricevuto via email per setup account, verifica se è valido o scaduto
export const verifySetupToken = async (token) => {
  const response = await axios.get(`${baseUrl}/api/auth/verify-setup-token`, { params: { token } });
  return response.data;
};


// POST RESET PASSWORD 
// invia email con link reset password
export const forgotPassword = async (email) => {
  const response = await axios.post(`${baseUrl}/api/auth/forgot-password`, { email });
  return response.data;
};
