import axios from "axios";
import { baseUrl, authConfig } from "../config";



// GET LISTA SESSIONI DI TEST
export const getSessions = async (token, projectId) => {
    // se passo projectId filtro per progetto, altrimenti ottengo tutte le mie sessioni
    const url = projectId
        ? `${baseUrl}/api/test-sessions?projectId=${projectId}`
        : `${baseUrl}/api/test-sessions`;
    const res = await axios.get(url, authConfig(token));
    return res.data;
};

// POST CREAZIONE NUOVA SESSIONE DI TEST
// nota : checklistItemIds è un array di id dele  task checklist da includere nella sessione di test

export const createSession = async (token, checklistItemIds) => {
    const res = await axios.post(`${baseUrl}/api/test-sessions`, { checklistItemIds }, authConfig(token));
    return res.data;
};



// PATCH RIAPRIRE SESSIONE DI TEST 
// nota : body {} vuoto e terzo parametro authConfig(token) per passare il token come header e non come body
export const reopenSession = async (token, sessionId) => {
    const res = await axios.patch(`${baseUrl}/api/test-sessions/${sessionId}/reopen`, {}, authConfig(token));
    return res.data;
};


// DELETE SESSIONE DI TEST
export const deleteSession = async (token, sessionId) => {
    const res = await axios.delete(`${baseUrl}/api/test-sessions/${sessionId}`, authConfig(token));
    return res.data;
};



// PATCH MODIFICA TASK DI UNA SESSIONE DI TEST
export const updateSessionTask = async (token,sessionId,itemId,sessionData) =>{

    const res = await axios.patch(`${baseUrl}/api/test-sessions/${sessionId}/task/${itemId}`, sessionData, authConfig(token))

    return res.data 


}



// PATCH RIAPRIRE TASK DI UNA SESSIONE DI TEST

export const reopenTaskOutcome = async (token, sessionId, itemId) => {
    const res = await axios.patch(`${baseUrl}/api/test-sessions/${sessionId}/task/${itemId}/reopen`, {}, authConfig(token));
    return res.data;
};


// GET DETTAGLIO SESSIONE DI TEST
export const getSessionDetail = async (token,sessionId) =>{


     const res = await axios.get(`${baseUrl}/api/test-sessions/${sessionId}`, authConfig(token))

    return res.data 

    

}

