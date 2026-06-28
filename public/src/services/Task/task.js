import axios from "axios";
import { baseUrl, authConfig } from "../config";



// per user tutte le task assegnate
// per ADMIN tutte le task assegnate a tutti gli utenti
// super-admin  vede tutto 
export const getAssignedTask = async (token) =>{

    const res = await axios.get(`${baseUrl}/api/checklists/task/assigned`,  authConfig(token));
    return res.data;
};


// 
export const assignTaskToUser = async (token, taskId, userId) => {
   const res = await axios.patch(`${baseUrl}/api/checklists/item/${taskId}/assign`, { userId }, authConfig(token));
    return res.data;
}


export const updateTaskStatus = async (token, taskId, status) => {
    const res = await axios.patch(`${baseUrl}/api/checklists/item/${taskId}/status`, { status }, authConfig(token));
    return res.data;
}