import AppLayout from "@/Components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import ManageUsers from "@/Components/features/users/ManageUsers";
import UserHeader from "@/Components/features/users/UserHeader";
import React,{useState,useEffect,useMemo} from "react";
import {users} from "../fake_data/data";

const Users = () => {
  
    const [newUserData,setNewUserData] = useState({

        name: '',
        surname: '',
        email: '',
        role: '',
        password: ''
    })
    const [modal,setModal] = useState(false);
    const [search,setSearch] = useState('');

    const addUser = () =>{
        console.log('nuvo utente', newUserData)


    }


    

   const filterUsers = useMemo(() =>{
    if (!search) return users;
    
    return users.filter((user) =>
     user.name.toLowerCase().includes(search.toLowerCase()) ||
    //   user.surname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);
  
   








    return (
        <AppLayout page="users">
            <UserHeader  
             modal={modal} setModal={setModal} search={search} setSearch={setSearch} newUserData={newUserData} setNewUserData={setNewUserData} addUser={addUser} />
            <ManageUsers 
         data={filterUsers}  />


        </AppLayout>
    )
}
export default Users;