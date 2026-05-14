import React,{useState,useEffect} from "react";
import { Search,Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NewUser from "./NewUser";


const UserHeader = ({modal,setModal,search,setSearch,
   newUserData,setNewUserData,addUser

})=>{


    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-[300px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input
               value={search}
               onChange={(e)=>{ setSearch(e.target.value)}}

                 placeholder="Cerca utente..."
                 className="pl-10 h-10 focus-visible:ring-emerald-500"
               />
            </div>
            <Button
              onClick={() => setModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-10 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Utente
            </Button>

            
            <NewUser setNewUserData={setNewUserData}  newUserData={newUserData} setModal={setModal} modal={modal} addUser={addUser}/>

              


        </div>
        

    )



}

export default UserHeader