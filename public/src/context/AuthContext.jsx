import {createContext, useState,useContext} from "react";
import { users } from "../fake_data/data";
import { loginUser,logout } from "@/services/api";
// 1. Creo il contesto
const AuthContext = createContext();

export const AuthProvider =({children})=>{

    // Dentro AuthProvider
// const canManageUsers = () => user?.role === 'superadmin';
// const canCreateProjects = () => user?.role === 'superadmin' || user?.role === 'admin';
// const canEditChecklist = () => user?.role === 'admin';
// const isTester = () => user?.role === 'tester';

    const [user,setUser] = useState(()=>{
        const storedUser = localStorage.getItem("user_test");
        return storedUser ? JSON.parse(storedUser) : null;
    });


    const login =async (email,password) =>{

        const response = await  loginUser(email,password);

        if(response.error){
            return {'error': 'Credenziali non valide'};
        }

        setUser(response.user);
        console.log(response)
      
        localStorage.setItem("user_test",JSON.stringify(response.user));
        localStorage.setItem("token_test",response.token);
        console.log("Login effettuato con successo:", response);

        return true;

        // const foundUser = users.find(u=>u.email === email && u.password === password);

        // if(foundUser){
        //     setUser(foundUser);
        //     localStorage.setItem("user_test",JSON.stringify(foundUser));
        //     console.log("Login effettuato con successo:", foundUser);
        //     return true;
        // }
      
        // console.error("Credenziali non valide");
        // return {'error': 'Credenziali non valide'};

    }


    const logout = async (token) => {
        try {
            await logout(token);
            setUser(null);
            localStorage.removeItem("user_test");
            localStorage.removeItem("token_test");
        } catch (error) {
            console.error("Logout failed:", error.response?.data || error.message);
        }
    }


    return (
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
    

export const useAuth = () => useContext(AuthContext);


