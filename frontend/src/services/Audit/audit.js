import axios from "axios";
import { baseUrl, authConfig } from "../config";


// GET GLOBAL AUDIT LOG 
// params opzionali : limit, dateFrom,dateTo
export const getGlobalAudit = async (token, limit, dateFrom, dateTo) => {
    const config = {
        ...authConfig(token),
        params: {
            limit,
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
        },
    };
    const res = await axios.get(`${baseUrl}/api/audit-log`, config);
    return res.data;
};

// GET PROJECT AUDIT LOG
// params opzionali : limit, dateFrom,dateTo
export const getProjectAudit = async (token, project_id, limit, dateFrom, dateTo) => {
    const config = {
        ...authConfig(token),
        params: {
            limit,
            ...(dateFrom && { dateFrom }),
            ...(dateTo && { dateTo }),
        },
    };
    const res = await axios.get(`${baseUrl}/api/projects/${project_id}/activities`, config);
    return res.data;
};
