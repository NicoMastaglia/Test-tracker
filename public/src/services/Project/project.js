import axios from "axios";
import { baseUrl, authConfig } from "../config";

export const getProjects = async (token) => {
    const res = await axios.get(`${baseUrl}/api/projects`, authConfig(token));
    return res.data;
};

export const createProject = async (token, projectData) => {
    const res = await axios.post(
        `${baseUrl}/api/projects`,
        projectData,
        authConfig(token),
    );
    return res.data;
};

export const getProjectById = async (token, projectId) => {
    const res = await axios.get(`${baseUrl}/api/projects/${projectId}`, authConfig(token));
    return res.data;
};

export const updateProject = async (token, projectId, projectData) => {
    const res = await axios.put(
        `${baseUrl}/api/projects/${projectId}`,
        projectData,
        authConfig(token),
    );
    return res.data;
};

export const deleteProject = async (token, projectId) => {
    const res = await axios.delete(`${baseUrl}/api/projects/${projectId}`, authConfig(token));
    return res.data;
};

export const updateProjectStatus = async (token, projectId, status) => {
    const res = await axios.patch(
        `${baseUrl}/api/projects/${projectId}/status`,
        { status },
        authConfig(token),
    );
    return res.data;
};

export const assignUserToProject = async (token, projectId, userId) => {
    const res = await axios.post(
        `${baseUrl}/api/projects/${projectId}/assign`,
        { userId },
        authConfig(token),
    );
    return res.data;
};


// disassegna utente da progetto
export const unAssingUserAssignment = async (token, projectId, userId) => {


    // axios.delete supports a config object with `data` for request body
    
    const config =  {
        ...authConfig(token),
        data: { userId }
    };
    const res = await axios.delete(`${baseUrl}/api/projects/${projectId}/assign`, config);
    return res.data;
};


export const  getProjectUsers = async (token, projectId) => {

    const res = await axios.get(`${baseUrl}/api/projects/${projectId}/assign`, authConfig(token));
    return res.data;
}








