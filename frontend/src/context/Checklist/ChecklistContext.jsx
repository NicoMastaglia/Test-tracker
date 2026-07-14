import { createContext, useContext, useReducer, useRef } from "react";
import { getToken } from "@/services/config";
import { createChecklist, deleteChecklist as deleteChecklistApi,
    getChecklistsByProject, updateChecklist as updateChecklistApi,
    addChecklistItem as addChecklistItemApi, updateChecklistItem as updateChecklistItemApi,
    deleteChecklistItem as deleteChecklistItemApi } from "@/services/Checklist/checklist";
import { checklistReducer, initialState } from "./ChecklistReducer";
import { useProjectContext } from "../Project/ProjectContext";

const ChecklistContext = createContext();

 export const ChecklistProvider = ({children}) =>{

    const [state,dispatch] = useReducer(checklistReducer,initialState)
    const { fetchProjects } = useProjectContext();
    
    
    // ref per tenere traccia della richiesta più recente per fetchChecklistsByProject
     const latestProjectRequestRef = useRef(0);



   const fetchChecklistsByProject = async (projectId) => {
    // id della chiamata corrente 
    const requestId = ++latestProjectRequestRef.current;
    
    // id dell'ultima richiesta effettuata
    latestProjectRequestRef.current = requestId;

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const data = await getChecklistsByProject(token,projectId)

        // Controlla se l'ID della richiesta corrente corrisponde all'ID della richiesta più recente
        // Se non corrisponde, significa che è stata effettuata una nuova richiesta 
        // e quindi ignoriamo i dati della richiesta precedente
        if (latestProjectRequestRef.current !== requestId) {
            return data;
        }

        dispatch({type:'SET_CHECKLIST_ITEMS',payload:data})
        return  data
    }
    catch(error){
        // se l'ultima richiesta non corrisponde a quella corrente, ignora l'errore
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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
