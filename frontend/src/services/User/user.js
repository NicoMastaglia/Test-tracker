import axios from 'axios'; 
import { baseUrl,authConfig } from '../config';

export const getUsers = async (token) => {
  const response = await axios.get(`${baseUrl}/api/users`, authConfig(token));
  return response.data;
};


export const  getCurrentUser =async (token) =>{

    const response  = await axios.get(`${baseUrl}/api/users/me`,authConfig(token))
    return response.data 

}

export  const updateCurrentUser = async(token,userData) =>{
    const response = await axios.put(`${baseUrl}/api/users/me`,userData,authConfig(token))
    return response.data
}

export  const updateCurrentUserPassword = async(token,Oldpassword,Newpassword) =>{


    const response = await axios.patch(`${baseUrl}/api/users/me/password`,{Oldpassword,Newpassword},authConfig(token))
    return response.data
}

    

/* PER ADMIN E SUPERADMIN*/

export const  getUserById = async (token,userId) =>{

    const response = await axios.get(`${baseUrl}/api/users/${userId}`,authConfig(token))
    return response.data 

}

export const updateUserById = async (token,userId,userData) =>{

    const response = await axios.put(`${baseUrl}/api/users/${userId}`,userData,authConfig(token))
    
    return response.data 

}

export  const deleteUserById = async (token,userId) =>{
    const response = await axios.delete(`${baseUrl}/api/users/${userId}`,authConfig(token))

    
    return response.data
}

export const updateUserRoleById = async (token,userId,newRole) =>{

    const response = await axios.patch(`${baseUrl}/api/users/${userId}/role`,{role:newRole},authConfig(token))

    
    return response.data 

}

export const getUserRelations = async (token,userId) =>{

    const response = await axios.get(`${baseUrl}/api/users/${userId}/relations`,authConfig(token))

    return response.data
}







