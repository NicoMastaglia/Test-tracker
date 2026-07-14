import {createContext, useContext} from "react";
import {
    getGlobalAudit as getGlobalAuditApi,
    getProjectAudit as getProjectAuditApi
} from "@/services/Audit/audit";

import {getToken} from "@/services/config";

const AuditContext = createContext();


export const AuditProvider = ({children}) => {


// GET  AUDIT LOG GLOBALE
const fetchGlobalAudit = async (limit, dateFrom, dateTo) => {
    const token = getToken();
    return getGlobalAuditApi(token, limit, dateFrom, dateTo);
};


// GET  AUDIT LOG DI UN PROGETTO 
const fetchProjectAudit = async (projectId, limit, dateFrom, dateTo) => {
    const token = getToken();
    return getProjectAuditApi(token, projectId, limit, dateFrom, dateTo);
};

return (
     <AuditContext.Provider value={{
        fetchGlobalAudit,
        fetchProjectAudit
        }}>
        {children}
     </AuditContext.Provider>
)



}

export const useAuditContext = () => useContext(AuditContext);
