
/*
es elenco sessioni test 
[{
id:,
project_id:,
user_id,
status:,
started_at:,
completed_at:,

}, 

]

 
 */




export const initialState = {

    // guarrdo tutte le sessioni per un progetto 
    sessions: [],    
    // dettaglio di una sessione selezionata, con i suoi item e i risultati dei test    
    selectedSession: null, 
    
    // elenco dei task di una sessione selezionata, con i risultati dei test
    sessionTask : [],
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
                sessionTask: action.payload.tasks,
                loading: false,
            };

        case 'CLEAR_SELECTED_SESSION':
            return { ...state, selectedSession: null, sessionTask: [], loading: false };

               

        case 'UPDATE_SESSION_STATUS':
            
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

        // case 'UPDATE_RESULT_ITEM':
           
        //     return {
        //         ...state,
        //         sessionItems: state.sessionItems.map((item) =>
        //             item.checklist_item_id === action.payload.checklist_item_id
        //                 ? { ...item, ...action.payload }
        //                 : item,
        //         ),
        //         loading: false,
        //     };

        default:
            return state;
    }
};
