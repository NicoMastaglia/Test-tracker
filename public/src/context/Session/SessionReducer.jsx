export const initialState = {

    
    sessions: [],        // lista "i miei lavori" (le mie sessioni)
    selectedSession: null, // sessione aperta nel dettaglio
    sessionItems: [],    // item + esiti della sessione aperta (test_result)
    loading: false,
    error: null,
};

export const sessionReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: true, error: null };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'SET_SESSIONS':
            return { ...state, sessions: action.payload, loading: false };

        case 'ADD_SESSION':
            return { ...state, sessions: [...state.sessions, action.payload], loading: false };

        case 'DELETE_SESSION':
            return {
                ...state,
                sessions: state.sessions.filter((s) => s.id !== action.payload),
                selectedSession:
                    state.selectedSession?.id === action.payload ? null : state.selectedSession,
                loading: false,
            };

        case 'SET_SELECTED_SESSION':
            // payload: { session, items }
            return {
                ...state,
                selectedSession: action.payload.session,
                sessionItems: action.payload.items,
                loading: false,
            };

        case 'CLEAR_SELECTED_SESSION':
            return { ...state, selectedSession: null, sessionItems: [], loading: false };

        case 'UPDATE_SESSION_STATUS':
            // payload: { id, status } -> aggiorna stato in lista e nel dettaglio
            return {
                ...state,
                sessions: state.sessions.map((s) =>
                    s.id === action.payload.id ? { ...s, status: action.payload.status } : s,
                ),
                selectedSession:
                    state.selectedSession?.id === action.payload.id
                        ? { ...state.selectedSession, status: action.payload.status }
                        : state.selectedSession,
                loading: false,
            };

        case 'UPDATE_RESULT_ITEM':
            // payload: il test_result aggiornato (id, session_id, checklist_item_id, is_tested, outcome, note)
            return {
                ...state,
                sessionItems: state.sessionItems.map((item) =>
                    item.checklist_item_id === action.payload.checklist_item_id
                        ? { ...item, ...action.payload }
                        : item,
                ),
                loading: false,
            };

        default:
            return state;
    }
};
