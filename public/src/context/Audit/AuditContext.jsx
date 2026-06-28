import {createContext, useContext} from "react";
import {
    getGlobalAudit as getGlobalAuditApi,
    getProjectAudit as getProjectAuditApi
} from "@/services/Audit/audit";

import {getToken} from "@/services/config";

const AuditContext = createContext();


export const AuditProvider = ({children}) => {

const  fetchGlobalAudit = async (limit) =>{
    try{
        const token = getToken()
        const globalAudit = await getGlobalAuditApi(token,limit)
        console.log("Dati:", globalAudit); // Log dei dati ricevuti
        return globalAudit
    }catch(error){
        throw error
    }
}

const  fetchProjectAudit = async (projectId, limit) =>{
    try{
        const token = getToken()
        const projectAudit = await getProjectAuditApi(token,projectId,limit)
        return projectAudit
    }catch(error){
        throw error
    }
}

return (
     <AuditContext.Provider value={{
        fetchGlobalAudit,
        fetchProjectAudit
        }}>
        {children}
     </AuditContext.Provider>
)



}

export const useAuditContext = () => useContext(AuditContext)
