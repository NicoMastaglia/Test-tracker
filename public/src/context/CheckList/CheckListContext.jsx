import { createContext, useContext, useReducer, useRef } from "react";
import { getToken } from "@/services/config";
import { createCheckList, deleteCheckList as deleteCheckListApi, 
    getCheckListsByProject, updateCheckList as updateCheckListApi } from "@/services/CheckList/checkList";
import { checkListReducer, initialState } from "./CheckListReducer";
import { useProjectContext } from "../Project/ProjectContext";

const CheckListContext = createContext();

const normalizeCheckListRow = (row) => ({
    ...row,
    id: row.template_id ?? row.id,
    template_id: row.template_id ?? row.id,
    project_id: row.project_id ?? row.projectId ?? null,
    title: row.title ?? row.name ?? "",
    last_update: row.last_update ?? row.updated_at ?? row.updatedAt ?? row.created_at ?? row.createdAt ?? null,
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

// const fetchCheckListsByProjects = async (projectIds = []) => {
//     const uniqueProjectIds = [...new Set(projectIds.map((projectId) => Number(projectId)).filter(Boolean))];

//     if (uniqueProjectIds.length === 0) {
//         dispatch({ type: 'SET_CHECKLIST_ITEMS', payload: [] });
//         return [];
//     }

//     dispatch({ type: 'SET_LOADING' });

//     try {
//         const token = getToken();
//         const results = await Promise.allSettled(
//             uniqueProjectIds.map((projectId) => getCheckListsByProject(token, projectId))
//         );

//         const combined = results
//             .filter((result) => result.status === 'fulfilled')
//             .flatMap((result) => (Array.isArray(result.value) ? result.value : []))
//             .map(normalizeCheckListRow);

//         const uniqueById = new Map();
//         combined.forEach((item) => {
//             uniqueById.set(item.id, item);
//         });

//         const checklistItems = [...uniqueById.values()];
//         dispatch({ type: 'SET_CHECKLIST_ITEMS', payload: checklistItems });
//         return checklistItems;
//     } catch (error) {
//         dispatch({ type: 'SET_ERROR', payload: error.message });
//         return [];
//     }
// };


const removeCheckList = async (checkListId) => {
    dispatch({type:'SET_LOADING'})

    try {
        const token = getToken()
        await deleteCheckListApi(token,checkListId)
        await fetchProjects()
        dispatch({type:'DELETE_CHECKLIST_ITEM',payload:checkListId})
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
        dispatch({type:'UPDATE_CHECKLIST_ITEM',payload:{id:checkListId,data:checkListData}})
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
        dispatch({type:'ADD_CHECKLIST_ITEM',payload:newCheckList})
    }

    catch(error){
        dispatch({type:'SET_ERROR',payload:error.message})

    }
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
          addCheckList }}>
            {children}
        </CheckListContext.Provider>
    );
};

export const useCheckListContext = () => useContext(CheckListContext);
