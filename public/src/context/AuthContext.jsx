import {createContext, useState,useContext} from "react";
import { users } from "../fake_data/data";

// 1. Creo il contesto
const AuthContext = createContext();

export const AuthProvider =({children})=>{

    // Dentro AuthProvider
// const canManageUsers = () => user?.role === 'superadmin';
// const canCreateProjects = () => user?.role === 'superadmin' || user?.role === 'admin';
// const canEditChecklist = () => user?.role === 'admin';
// const isTester = () => user?.role === 'tester';

    const [user,setUser] = useState(()=>{

        const current_user = localStorage.getItem("user_test");

        return current_user ? JSON.parse(current_user) : null;

    });


    const login =(email,password) =>{

        const foundUser = users.find(u=>u.email === email && u.password === password);

        if(foundUser){
            setUser(foundUser);
            localStorage.setItem("user_test",JSON.stringify(foundUser));
            console.log("Login effettuato con successo:", foundUser);
            return true;
        }
      
        console.error("Credenziali non valide");
        return {'error': 'Credenziali non valide'};

    }


    const logout = () =>{
        localStorage.removeItem("user_test");
        setUser(null);
    }


    return (
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
    

export const useAuth = () => useContext(AuthContext);


