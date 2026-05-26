import { useState,useEffect,useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
import ActionBar from "@/utils/ActionBar";
import {useAuthContext} from "@/context/Auth/AuthContext";
import { toast } from "sonner";
import AdminCheckListTable from "@/Components/features/checkList/AdminCheckListTable";
const CheckList = () => {

    const [search,setSearch] = useState("");
    const [modal,setModal] = useState(false);
    // const navigate = useNavigate();
    // const [searchParams] = useSearchParams();

    const {id} = useParams();

    const {fetchCheckListsByProject,checklistItems} = useCheckListContext();
    const {user} = useAuthContext();
    
    
    

    useEffect(() => {
        if(id){
            fetchCheckListsByProject(id)
        }
    }, [id])
    

    return (
        <AppLayout page="checklists">
                <div className="space-y-6">
                     <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <ActionBar
                        search={search}
                        setSearch={setSearch}
                        placeholder="Cerca checklist..."
                        buttonText={user?.role === 'admin' ? 'Add CheckList Template' : null}
                        onButtonClick={() => setModal(true)}
                        buttonVariant="emerald"
                    />
                  
                <div className="pt-4">

                    {
                           
                        /*
                        new template checkList*/
                    }
                </div>
                </div>

                 <AdminCheckListTable checklistItems={checklistItems}/>


                </div>
            
        </AppLayout>
    );
};

export default CheckList;
