import AppLayout from "@/Components/layout/AppLayout";

import ManageUsers from "@/Components/features/users/ManageUsers";
import UserHeader from "@/Components/features/users/UserHeader";
import React,{useState,useEffect,useMemo} from "react";
import { register } from "@/services/api";
import { toast } from "sonner";
import { useUsersContext } from "@/context/User/UserContext";

const Users = () => {

    const [token,setToken] = useState(localStorage.getItem("auth_token"));
    const {users,fetchUsers } = useUsersContext()
  
    const [newUserData,setNewUserData] = useState({

        name: '',
        surname: '',
        email: '',
        role: '',
        password: ''
    })
    const [modal,setModal] = useState(false);
    const [search,setSearch] = useState('');


    useEffect(()=>{
        fetchUsers()
    },[])

    const addUser = async () =>{
        const {name,surname,email,role,password} = newUserData; 
        try {
            await register(name,surname,email,password,role,token)
            toast.success("Utente creato con successo!")
            setModal(false)
        } catch (error) {
            console.error("Errore durante la creazione dell'utente:", error.response?.data || error.message)
            toast.error("Errore durante la creazione dell'utente")
        }
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
         data={users}  />


        </AppLayout>
    )
}
export default Users;