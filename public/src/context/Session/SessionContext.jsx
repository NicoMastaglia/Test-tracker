import { createContext, useContext, useReducer } from "react";
import { initialState, sessionReducer } from "./SessionReducer";
import { getToken } from "@/services/config";
import {
    getSessions,
    createSession as createSessionApi,
    completeSession as completeSessionApi,
    reopenSession as reopenSessionApi,
    deleteSession as deleteSessionApi,
} from "@/services/Session/session";
import {
    getSessionResults,
    updateResultItem as updateResultItemApi,
} from "@/services/Session/testResult";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(sessionReducer, initialState);

    // lista "i miei lavori". Il BE risponde 404 quando non ci sono sessioni:
    // lo trattiamo come lista vuota, non come errore.
    const fetchSessions = async (projectId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            const sessions = await getSessions(token, projectId);
            dispatch({ type: 'SET_SESSIONS', payload: sessions });
        } catch (error) {
            if (error.response?.status === 404) {
                dispatch({ type: 'SET_SESSIONS', payload: [] });
                return;
            }
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const createSession = async (projectId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            const created = await createSessionApi(token, projectId);
            await fetchSessions();
            return created;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    const completeSession = async (sessionId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            await completeSessionApi(token, sessionId);
            dispatch({ type: 'UPDATE_SESSION_STATUS', payload: { id: sessionId, status: 'Completata' } });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

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

    // dettaglio sessione: { session, items }
    const fetchSessionResults = async (sessionId) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const token = getToken();
            const data = await getSessionResults(token, sessionId);
            dispatch({
                type: 'SET_SELECTED_SESSION',
                payload: { session: data.session, items: data.items ?? [] },
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const updateResultItem = async (sessionId, itemId, data) => {
        try {
            const token = getToken();
            const updated = await updateResultItemApi(token, sessionId, itemId, data);
            dispatch({ type: 'UPDATE_RESULT_ITEM', payload: updated });
            return updated;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    const clearSelectedSession = () => dispatch({ type: 'CLEAR_SELECTED_SESSION' });

    return (
        <SessionContext.Provider value={{
            sessions: state.sessions,
            selectedSession: state.selectedSession,
            sessionItems: state.sessionItems,
            loading: state.loading,
            error: state.error,
            fetchSessions,
            createSession,
            completeSession,
            reopenSession,
            deleteSession,
            fetchSessionResults,
            updateResultItem,
            clearSelectedSession,
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => useContext(SessionContext);
