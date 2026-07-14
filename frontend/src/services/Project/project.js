import axios from "axios";
import { baseUrl, authConfig } from "../config";


// GET  LISTA PROGETTI 
export const getProjects = async (token) => {
    const res = await axios.get(`${baseUrl}/api/projects`, authConfig(token));
    return res.data;
};

//  POST NUOVO PROGETTO 
export const createProject = async (token, projectData) => {
    const res = await axios.post(
        `${baseUrl}/api/projects`,
        projectData,
        authConfig(token),
    );
    return res.data;
};

// GET PROGETTO PER ID
// solo admin/superadmin
export const getProjectById = async (token, projectId) => {
    const res = await axios.get(`${baseUrl}/api/projects/${projectId}`, authConfig(token));
    return res.data;
};

// PUT MODIFICA PROGETTO
export const updateProject = async (token, projectId, projectData) => {
    const res = await axios.put(
        `${baseUrl}/api/projects/${projectId}`,
        projectData,
        authConfig(token),
    );
    return res.data;
};

// DELETE PROGETTO
export const deleteProject = async (token, projectId) => {
    const res = await axios.delete(`${baseUrl}/api/projects/${projectId}`, authConfig(token));
    return res.data;
};

// PATCH MODIFICA STATO PROGETTO
export const updateProjectStatus = async (token, projectId, status) => {
    const res = await axios.patch(
        `${baseUrl}/api/projects/${projectId}/status`,
        { status },
        authConfig(token),
    );
    return res.data;
};

// POST ASSEGNAZIONE UTENTE A PROGETTO
export const assignUserToProject = async (token, projectId, userId) => {
    const res = await axios.post(
        `${baseUrl}/api/projects/${projectId}/assign`,
        { userId },
        authConfig(token),
    );
    return res.data;
};


// DELETE RIMOZIONE ASSEGNAZIONE UTENTE DA PROGETTO
// nota : axios.delete non accetta un body come secondo parametro,
// userId viene passato come data (dentro config) nel header della req 
export const unAssingUserAssignment = async (token, projectId, userId) => {


   
    
    const config =  {
        ...authConfig(token),
        data: { userId }
    };
    const res = await axios.delete(`${baseUrl}/api/projects/${projectId}/assign`, config);
    return res.data;
};


// GET LISTA UTENTI ASSEGNATI A PROGETTO
export const  getProjectUsers = async (token, projectId) => {

    const res = await axios.get(`${baseUrl}/api/projects/${projectId}/assign`, authConfig(token));
    return res.data;
}

// GET STATISTICHE PROGETTO
// SOLO ADMIN/SUPERADMIN
export const getProjectStats = async (token, projectId) => {
    const res = await axios.get(`${baseUrl}/api/projects/${projectId}/stats`, authConfig(token));
    return res.data;
}








