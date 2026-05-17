import React,{useState,useEffect} from "react";
import { Search,Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NewUser from "./NewUser";
import ActionBar from "@/utilis/ActionBar";

const UserHeader = ({modal,setModal,search,setSearch,
   newUserData,setNewUserData,addUser

})=>{


    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <ActionBar
        search={search}
        setSearch={setSearch}
        placeholder="Cerca utente..."
        buttonText="Add User"
        onButtonClick={() => setModal(true)}
        buttonVariant="emerald"
      />

            
            <NewUser setNewUserData={setNewUserData}  newUserData={newUserData} setModal={setModal} modal={modal} addUser={addUser}/>

              


        </div>
        

    )



}

export default UserHeader