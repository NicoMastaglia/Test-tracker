import AppLayout from "@/Components/layout/AppLayout";

import ManageUsers from "@/Components/features/users/ManageUsers";
import UserHeader from "@/Components/features/users/UserHeader";
import React,{useState,useEffect,useMemo} from "react";
import { register } from "@/services/api";
import { toast } from "sonner";
import { useUsersContext } from "@/context/User/UserContext";

const Users = () => {

    const [token,setToken] = useState(localStorage.getItem("auth_token"));
    const {users,fetchUsers} = useUsersContext()
  
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
        console.log(typeof editUser)
    },[])

    const addUser = async () =>{
        const {name,surname,email,role,password} = newUserData; 
        try {
            await register(name,surname,email,password,role,token)
            await fetchUsers()
            toast.success("Utente creato con successo!")
            setModal(false)
        } catch (error) {
            console.error("Errore durante la creazione dell'utente:", error.response?.data || error.message)
            toast.error("Errore durante la creazione dell'utente")
        }
    }


    const filterUsers = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) return users;

        return users.filter((user) => {
            const name = (user.nome ?? user.name ?? "").toLowerCase();
            const surname = (user.cognome ?? user.surname ?? "").toLowerCase();
            const email = (user.email ?? "").toLowerCase();
            const role = (user.role ?? "").toLowerCase();

            return (
                name.includes(normalizedSearch) ||
                surname.includes(normalizedSearch) ||
                email.includes(normalizedSearch) ||
                role.includes(normalizedSearch)
            );
        });
    }, [search, users]);
  
    return (
        <AppLayout page="users">
            <UserHeader  
             modal={modal} setModal={setModal} search={search} setSearch={setSearch} newUserData={newUserData} setNewUserData={setNewUserData}
              addUser={addUser} />
            <ManageUsers 
                            data={filterUsers}
                        />


        </AppLayout>
    )
}
export default Users;
