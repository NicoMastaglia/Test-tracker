import { useState,useEffect,useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/Components/layout/AppLayout";
import { useCheckListContext } from "@/context/CheckList/CheckListContext";
const CheckList = () => {

    const {id} = useParams();

    const {fetchCheckListsByProject,checklistItems} = useCheckListContext();
    

    useEffect(() => {
        if(id){
            fetchCheckListsByProject(id)
        }
    }, [id])
    

    return (
        <AppLayout page="checklists">
                <div className="space-y-6">
                   
                    
                </div>
        </AppLayout>
    );
};

export default CheckList;
