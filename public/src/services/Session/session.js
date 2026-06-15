import axios from "axios";
import { baseUrl, authConfig } from "../config";



// ottengo tutte le sessuioni di un progetto tramite id 
export const getSessions = async (token, projectId) => {
    // se passo projectId filtro per progetto, altrimenti ottengo tutte le mie sessioni
    const url = projectId
        ? `${baseUrl}/api/test-sessions?projectId=${projectId}`
        : `${baseUrl}/api/test-sessions`;
    const res = await axios.get(url, authConfig(token));
    return res.data;
};

// creo una nuova sessione di test 
export const createSession = async (token, projectId) => {
    const res = await axios.post(`${baseUrl}/api/test-sessions`, { projectId }, authConfig(token));
    return res.data;
};

// imposto lo stato di una sessione di test a completata
export const completeSession = async (token, sessionId) => {
    // PATCH senza body: axios.patch(url, data, config) -> data = {}, config = authConfig
    const res = await axios.patch(`${baseUrl}/api/test-sessions/${sessionId}/complete`, {}, authConfig(token));
    return res.data;
};

// riapro una sessione di test completata, tornando allo stato "in corso"
export const reopenSession = async (token, sessionId) => {
    const res = await axios.patch(`${baseUrl}/api/test-sessions/${sessionId}/reopen`, {}, authConfig(token));
    return res.data;
};

// cancella una sessione di test
export const deleteSession = async (token, sessionId) => {
    const res = await axios.delete(`${baseUrl}/api/test-sessions/${sessionId}`, authConfig(token));
    return res.data;
};
