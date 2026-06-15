import axios from "axios";
import { baseUrl, authConfig } from "../config";



// ottengo tutti i risultati di una sessione
export const getSessionResults = async (token, sessionId) => {
    const res = await axios.get(`${baseUrl}/api/test-results/session/${sessionId}`, authConfig(token));
    return res.data;
};


//  aggiorno un risultato di un item di una sessione
export const updateResultItem = async (token, sessionId, itemId, data) => {
    // data: { is_tested?, outcome?, note? }
    const res = await axios.patch(
        `${baseUrl}/api/test-results/session/${sessionId}/item/${itemId}`,
        data,
        authConfig(token),
    );
    return res.data;
};
