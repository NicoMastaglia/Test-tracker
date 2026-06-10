import { createContext, useContext, useReducer, useRef } from "react";
import { getToken } from "@/services/config";
import { createCheckList, deleteCheckList as deleteCheckListApi,
    getCheckListsByProject, updateCheckList as updateCheckListApi,
    addCheckListItem as addCheckListItemApi, updateCheckListItem as updateCheckListItemApi,
    deleteCheckListItem as deleteCheckListItemApi } from "@/services/CheckList/checkList";
import { checkListReducer, initialState } from "./CheckListReducer";
import { useProjectContext } from "../Project/ProjectContext";

const CheckListContext = createContext();


// Normalizza una riga (checklist x item)
const normalizeCheckListRow = (row) => ({
    checklist_id: row.checklist_id ?? row.template_id ?? row.id ?? null,
    title: row.title ?? row.name ?? "",
    project_id: row.project_id ?? row.projectId ?? null,
    item_id: row.item_id ?? null,
    description: row.description ?? "",
    position: row.position ?? null,
});


 export const CheckListProvider = ({children}) =>{

    const [state,dispatch] = useReducer(checkListReducer,initialState)
    const { fetchProjects } = useProjectContext();
     const latestProjectRequestRef = useRef(0);



   const fetchCheckListsByProject = async (projectId) => {
    const requestId = latestProjectRequestRef.current + 1;
    latestProjectRequestRef.current = requestId;

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const data = await getCheckListsByProject(token,projectId)
        const normalized = Array.isArray(data) ? data.map(normalizeCheckListRow) : []

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




const removeCheckList = async (checkListId) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await deleteCheckListApi(token,checkListId)
        await fetchProjects()
        dispatch({type:'DELETE_CHECKLIST',payload:checkListId})
    }
    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
}


const updateCheckList = async (checkListId,checkListData) => {

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await updateCheckListApi(token,checkListId,checkListData)
        await fetchProjects()
        dispatch({type:'UPDATE_CHECKLIST',payload:{id:checkListId,data:checkListData}})
    }
    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})
    }
}


const addCheckList = async (checkListData) => {

    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const newCheckList = await createCheckList(token,checkListData)
        await fetchProjects()
        dispatch({type:'ADD_CHECKLIST',payload:newCheckList})
    }

    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})

    }
}

const addCheckListItem = async (templateId, itemData) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        const newItem = await addCheckListItemApi(token, templateId, itemData)
        dispatch({type:'ADD_TASK', payload:{templateId, item: newItem}})
    }
    catch(error){
        dispatch({type:'SET_ERROR', payload:error.message})
    }
}

const updateCheckListItem = async (itemId, itemData) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await updateCheckListItemApi(token, itemId, itemData)
        dispatch({type:'UPDATE_TASK', payload:{id: itemId, data: itemData}})
    }
    catch(error){
        dispatch({type:'SET_ERROR', payload:error.message})
    }
}

const removeCheckListItem = async (itemId) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await deleteCheckListItemApi(token, itemId)
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
        <CheckListContext.Provider value={{
             checklistItems: state.checklistItems,
          loading: state.loading,
          error: state.error,
         selectedChecklist: state.selectedChecklist,
             fetchCheckListsByProject,
            //  fetchCheckListsByProjects,
         removeCheckList,
         updateCheckList,
         addCheckList,
         addCheckListItem,
         updateCheckListItem,
         removeCheckListItem,
         selectChecklist,
         clearChecklist }}>
            {children}
        </CheckListContext.Provider>
    );
};

export const useCheckListContext = () => useContext(CheckListContext);
