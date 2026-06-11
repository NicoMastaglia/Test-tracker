import { createContext, useContext, useReducer, useRef } from "react";
import { getToken } from "@/services/config";
import { createChecklist, deleteChecklist as deleteChecklistApi,
    getChecklistsByProject, updateChecklist as updateChecklistApi,
    addChecklistItem as addChecklistItemApi, updateChecklistItem as updateChecklistItemApi,
    deleteChecklistItem as deleteChecklistItemApi } from "@/services/Checklist/checklist";
import { checklistReducer, initialState } from "./ChecklistReducer";
import { useProjectContext } from "../Project/ProjectContext";

const ChecklistContext = createContext();


// Normalizza una riga (checklist x item)
const normalizeChecklistRow = (row) => ({
    checklist_id: row.checklist_id ?? row.template_id ?? row.id ?? null,
    title: row.title ?? row.name ?? "",
    project_id: row.project_id ?? row.projectId ?? null,
    item_id: row.item_id ?? null,
    description: row.description ?? "",
    position: row.position ?? null,
});


 export const ChecklistProvider = ({children}) =>{

    const [state,dispatch] = useReducer(checklistReducer,initialState)
    const { fetchProjects } = useProjectContext();
     const latestProjectRequestRef = useRef(0);



   const fetchChecklistsByProject = async (projectId) => {
    const requestId = latestProjectRequestRef.current + 1;
    latestProjectRequestRef.current = requestId;

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const data = await getChecklistsByProject(token,projectId)
        const normalized = Array.isArray(data) ? data.map(normalizeChecklistRow) : []

        if (latestProjectRequestRef.current !== requestId) {
            return normalized;
        }

        dispatch({type:'SET_CHECKLIST_ITEMS',payload:normalized})
        return normalized
    }
    catch(error){
        if (latestProjectRequestRef.current !== requestId) {
            return [];
        }

        dispatch({type:'SET_ERROR',payload:error.message})
        return []

 }


}




const removeChecklist = async (checklistId) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await deleteChecklistApi(token,checklistId)
        await fetchProjects()
        dispatch({type:'DELETE_CHECKLIST',payload:checklistId})
    }
    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
}


const updateChecklist = async (checklistId,checklistData) => {

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await updateChecklistApi(token,checklistId,checklistData)
        await fetchProjects()
        dispatch({type:'UPDATE_CHECKLIST',payload:{id:checklistId,data:checklistData}})
    }
    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
}


const addChecklist = async (checklistData) => {

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const newChecklist = await createChecklist(token,checklistData)
        await fetchProjects()
        dispatch({type:'ADD_CHECKLIST',payload:newChecklist})
    }

    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})

    }
}

const addChecklistItem = async (templateId, itemData) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const newItem = await addChecklistItemApi(token, templateId, itemData)
        dispatch({type:'ADD_TASK', payload:{templateId, item: newItem}})
    }
    catch(error){
        dispatch({type:'SET_ERROR', payload:error.message})
    }
}

const updateChecklistItem = async (itemId, itemData) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await updateChecklistItemApi(token, itemId, itemData)
        dispatch({type:'UPDATE_TASK', payload:{id: itemId, data: itemData}})
    }
    catch(error){
        dispatch({type:'SET_ERROR', payload:error.message})
    }
}

const removeChecklistItem = async (itemId) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await deleteChecklistItemApi(token, itemId)
        dispatch({type:'DELETE_TASK', payload:itemId})
    }
    catch(error){
        dispatch({type:'SET_ERROR', payload:error.message})
    }
}

const selectChecklist = (checklist) => {
    dispatch({type:'SET_SELECTED_CHECKLIST', payload: checklist})
}

const clearChecklist = () => {
    dispatch({type:'CLEAR_SELECTED_CHECKLIST'})
}

    return (
        <ChecklistContext.Provider value={{
             checklistItems: state.checklistItems,
          loading: state.loading,
          error: state.error,
         selectedChecklist: state.selectedChecklist,
             fetchChecklistsByProject,
            //  fetchChecklistsByProjects,
         removeChecklist,
         updateChecklist,
         addChecklist,
         addChecklistItem,
         updateChecklistItem,
         removeChecklistItem,
         selectChecklist,
         clearChecklist }}>
            {children}
        </ChecklistContext.Provider>
    );
};

export const useChecklistContext = () => useContext(ChecklistContext);
