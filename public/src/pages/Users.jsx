import AppLayout from "@/Components/layout/AppLayout";

import ManageUsers from "@/Components/features/users/ManageUsers";
import NewUser from "@/Components/features/users/NewUser";
import ActionBar from "@/utils/ActionBar";
import React,{useState,useEffect,useMemo} from "react";
import { register } from "@/services/api";
import { toast } from "sonner";
import { useUserContext } from "@/context/User/UserContext";
import {filterSearch} from "@/utils/filterSearch";
import ModalForm from "@/utils/ModalForm";
import { userFields } from "@/utils/fields/userFields";


const Users = () => {

    const emptyNewUserData = {
        name: '',
        surname: '',
        email: '',
        role: '',
        password: ''
    }

    const [token,setToken] = useState(localStorage.getItem("auth_token"));
    const {users,fetchUsers} = useUserContext()
  
    const [newUserData,setNewUserData] = useState(emptyNewUserData)
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
            setNewUserData(emptyNewUserData)
            setModal(false)
        } catch (error) {
            console.error("Errore durante la creazione dell'utente:", error.response?.data || error.message)
            toast.error("Errore durante la creazione dell'utente")
        }
    }


    const filterUsers = useMemo(()=>{
        return filterSearch(search,users,['nome','cognome','email'])

    },[search,users])

   
  
    return (
        <AppLayout page="users">
            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <ActionBar
                        search={search}
                        setSearch={setSearch}
                        placeholder="Cerca utente..."
                        buttonText="Add User"
                        onButtonClick={() => setModal(true)}
                        buttonVariant="emerald"
                    />
                    <div className="pt-4">
                        {/* <NewUser
                            setNewUserData={setNewUserData}
                            newUserData={newUserData}
                            setModal={setModal}
                            modal={modal}
                            addUser={addUser}
                        /> */}
                        <ModalForm 
                    modalOpen={modal}
                    setModalOpen={setModal}
                    onClose={() => setNewUserData(emptyNewUserData)}
                    title="Aggiungi Nuovo Utente"
                    infos="Compila i campi per creare un nuovo utente."
                    fields={userFields}
                    formData={newUserData}
                    setFormData={setNewUserData}
                    onSubmit={addUser}
                    submitLabel="Crea"
                    cancelLabel="Annulla"
                    submitClassName="bg-emerald-600 text-white hover:bg-emerald-700"

                        />

                    </div>
                </div>

                <ManageUsers data={filterUsers} />
            </div>


        </AppLayout>
    )
}
export default Users;
