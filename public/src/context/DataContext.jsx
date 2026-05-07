import {users,sessions,projects} from "../fake_data/data";
import { createContext, useState, useEffect,useReducer } from "react";



const getFromStorage  = (key,fallback) => {

    try{
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    }
    catch(error){
        console.error("Errore nel recupero da localStorage:",error);
        return fallback;
    }



}
const initialState = {
    users:  getFromStorage("users",users),
    sessions:  getFromStorage("sessions",sessions),
    projects: getFromStorage("projects",projects)
  };



function dataReducer(state, action) {
}

