import axios from "axios";
import { baseUrl, authConfig } from "../config";



export const getGlobalAudit = async (token,limit) =>{

    const config = {
        ...authConfig(token),
        params: { limit }
    }
    

 
    const res = await axios.get(`${baseUrl}/api/audit-log`, config);

    return res.data


}


export  const getProjectAudit = async (token,project_id,limit)=>{


   const config = {
    ...authConfig(token),
    params: { limit }
   }

   const res = await  axios.get(`${baseUrl}/api/projects/${project_id}/activities`, config);

   return res.data;
}