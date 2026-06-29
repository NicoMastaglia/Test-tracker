import {createContext, useReducer,useContext} from "react";
import {getToken} from "@/services/config";
import {initialState, taskReducer} from "./TaskReducer";
import{

    getAssignedTask as getAssignedTaskApi,
    assignTaskToUser as assignTaskToUserApi,
    updateTaskStatus as updateTaskStatusApi,
    unassignTask as unassignTaskApi
} from "@/services/Task/task";

const TaskContext = createContext();


export const TaskProvider = ({children}) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);


    const fetchAssignedTasks = async () => {
        dispatch({type:'SET_LOADING'})

        try {
            const token = getToken();
            const assignedTask = await getAssignedTaskApi(token);
            dispatch({type:'SET_ASSIGNED_TASKS', payload: assignedTask})

         
        }
        catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
        }



    }  

    const assignTaskToUser = async (taskId, userId) => {
        dispatch({type:'SET_LOADING'})

        try {
            const token = getToken();
            const assignedTask = await assignTaskToUserApi(token, taskId, userId);
           
            
            // await fetchAssignedTasks();
            return assignedTask;
         
        }catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error;
        }

    }


    const  updateTask =  async (taskId,status ) =>{
       dispatch({type:'SET_LOADING'})

       try {
        const token = getToken()
        const updatedTask = await updateTaskStatusApi(token, taskId, status);


        //  await fetchAssignedTasks();

       


  
        return updatedTask;
     
       }
       catch (error) {
        dispatch({type:'SET_ERROR', payload: error.message})
        throw error;
    }

     }

    const unassignTask = async (taskId) => {
        dispatch({type:'SET_LOADING'})

        try {
            const token = getToken();
            const result = await unassignTaskApi(token, taskId);
            // await fetchAssignedTasks();
            return result;
        } catch (error) {
            dispatch({type:'SET_ERROR', payload: error.message})
            throw error;
        }
    }


    return (
        <TaskContext.Provider value={{
            assignedTasks: state.assignedTasks,
            loading: state.loading,
            error: state.error,

            fetchAssignedTasks,
            assignTaskToUser,
            updateTask,
            unassignTask

         }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskContext = () => useContext(TaskContext);
