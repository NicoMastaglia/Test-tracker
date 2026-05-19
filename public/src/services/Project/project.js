import { baseUrl,authConfig } from "../config";


export const getProjects = async (token) =>{

         const  res = await axios.get(`${baseUrl}/api/projects`,authConfig(token))

         return res.data 
   
}

export const createProject = async(token,projectData) =>{
    const res = await axios.post(`${baseUrl}/api/projects`,projectData,authConfig(token))
    return res.data
}