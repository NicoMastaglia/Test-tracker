


export const initialState = {
    checklistItems: [],
    loading: false,
    error: null,
    selectedChecklist: null,
};


export const checkListReducer = (state, action) => {

    switch (action.type) {
        case 'SET_SELECTED_CHECKLIST':
            return {
                ...state,
                selectedChecklist: action.payload,
                loading: false,
            };
        case 'CLEAR_SELECTED_CHECKLIST':
            return {
                ...state,
                selectedChecklist: null,
                loading: false,
            };
    
    case 'SET_LOADING':
        return {
            ...state,
            loading: true,
            error: null,
        };
    case 'SET_ERROR':
        return {
            ...state,
            error: action.payload,
            loading: false,
        };
    
    case 'ADD_CHECKLIST':
        return {
            ...state,
            checklistItems: [...state.checklistItems, action.payload],
            loading: false,
        };
    
    case 'SET_CHECKLIST_ITEMS':
        return {
            ...state,
            checklistItems: action.payload,
            loading: false,
        };
    
    case 'UPDATE_CHECKLIST':
        return {
            ...state,
            checklistItems: state.checklistItems.map(item =>
                item.id === action.payload.id ? action.payload : item
            ),
            loading: false,
        };
    
    case 'DELETE_CHECKLIST':
        return {
            ...state,
            checklistItems: state.checklistItems.filter(item => item.id !== action.payload),
            loading: false
        }

    case 'ADD_TASK':
        return {
            ...state,
            checklistItems: state.checklistItems.map(checklist =>
                checklist.id === action.payload.templateId
                    ? { ...checklist, items: [...(checklist.items ?? []), action.payload.item] }
                    : checklist
            ),
            loading: false,
        };

    case 'UPDATE_TASK':
        return {
            ...state,
            checklistItems: state.checklistItems.map(checklist => ({
                ...checklist,
                items: (checklist.items ?? []).map(item =>
                    item.id === action.payload.id ? { ...item, ...action.payload.data } : item
                ),
            })),
            loading: false,
        };

    case 'DELETE_TASK':
        return {
            ...state,
            checklistItems: state.checklistItems.map(checklist => ({
                ...checklist,
                items: (checklist.items ?? []).filter(item => item.id !== action.payload),
            })),
            loading: false,
        };

    default:
        return state;

    }

    };