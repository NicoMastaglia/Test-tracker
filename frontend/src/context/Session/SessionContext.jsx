import { createContext, useContext, useReducer } from "react";
import { initialState, sessionReducer } from "./SessionReducer";
import { getToken } from "@/services/config";
import {
    getSessions as getSessionsApi,
    createSession as createSessionApi,
  
    reopenSession as reopenSessionApi,
    deleteSession as deleteSessionApi,
    updateSessionTask as updateSessionTaskApi,
    getSessionDetail as getSessionDetailApi,
} from "@/services/Session/session";


const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(sessionReducer, initialState);


    // dettaglio sessione di test 
    const fetchSessionsDetail = async (sessionId) => {
        dispatch({type:'SET_LOADING'})

        try{
            const token = getToken()

            const sessionDetail = await getSessionDetailApi(token,sessionId)
            dispatch({type:'SET_SELECTED_SESSION',payload : sessionDetail})
        }catch(error){
            


            dispatch({type:'SET_ERROR',payload:error.message  })

        }

    }

     const updateSessionTask = async (sessionId,itemId,status) => {
        dispatch({type:'SET_LOADING'})

        try{
            const token = getToken()

            const updatedTask = await updateSessionTaskApi(token,sessionId,itemId,status)
            await fetchSessionsDetail(sessionId)
            return updatedTask
        }catch(error){
            dispatch({type:'SET_ERROR',payload:error.message  })
            throw error
        }

    }



   
    
    const fetchSessions = async (projectId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            // GET /api/test-sessions risponde 200 con array vuoto se non ci sono
            // sessioni: nessun caso 404 da gestire qui, solo errori reali.
            const sessions = await getSessionsApi(token, projectId);
            dispatch({ type: 'SET_SESSIONS', payload: sessions });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const createSession = async (checklistitemsId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            const created = await createSessionApi(token, checklistitemsId);
            await fetchSessions();
            return created;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    // const completeSession = async (sessionId) => {
    //     dispatch({ type: 'SET_LOADING' });
    //     try {
    //         const token = getToken();
    //         await completeSessionApi(token, sessionId);
    //         dispatch({ type: 'UPDATE_SESSION_STATUS', payload: { id: sessionId, status: 'Completata' } });
    //     } catch (error) {
    //         dispatch({ type: 'SET_ERROR', payload: error.message });
    //         throw error;
    //     }
    // };

    const reopenSession = async (sessionId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            await reopenSessionApi(token, sessionId);
            dispatch({ type: 'UPDATE_SESSION_STATUS', payload: { id: sessionId, status: 'In corso' } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    const deleteSession = async (sessionId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            await deleteSessionApi(token, sessionId);
            dispatch({ type: 'DELETE_SESSION', payload: sessionId });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

  

    const clearSelectedSession = () => dispatch({ type: 'CLEAR_SELECTED_SESSION' });

    return (
        <SessionContext.Provider value={{
            sessions: state.sessions,
            sessionTask: state.sessionTask,
            selectedSession: state.selectedSession,
      
            loading: state.loading,
            error: state.error,
            fetchSessions,
            createSession,
            updateSessionTask,
            fetchSessionsDetail,
            reopenSession,
            deleteSession,
            clearSelectedSession,
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => useContext(SessionContext);
