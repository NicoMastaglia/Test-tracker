import axios from "axios";
import { baseUrl, authConfig } from "../config";



// GET DETTAGLIO TASK
export const getAssignedTask = async (token) =>{

    const res = await axios.get(`${baseUrl}/api/checklists/task/assigned`,  authConfig(token));
    return res.data;
};


// GET DETTAGLIO TASK PER ID
export const assignTaskToUser = async (token, taskId, userId) => {
   const res = await axios.patch(`${baseUrl}/api/checklists/item/${taskId}/assign`, { userId }, authConfig(token));
    return res.data;
}


// PATCH MODIFICA STATO TASK
export const updateTaskStatus = async (token, taskId, status) => {
    const res = await axios.patch(`${baseUrl}/api/checklists/item/${taskId}/status`, { status }, authConfig(token));
    return res.data;
}
// PATCH RIMUOVE ASSEGNAZIONE DI UNA TASK 
export const unassignTask = async (token, taskId) => {
    const res = await axios.patch(`${baseUrl}/api/checklists/item/${taskId}/unassign`, {}, authConfig(token));
    return res.data;
}