import AppRouter from './Router/AppRouter.jsx'
import './App.css'
import {users,projects,sessions} from './fake_data/data.js'
import {useState,useEffect} from "react";
function App() {



  useEffect(()=>{
  let storedUser = localStorage.getItem("user_test");

  if(!storedUser){
    localStorage.setItem("user_test",JSON.stringify(users));
  
  }
   },[])

  return (
    <>
      <AppRouter />
    </>
  )
} 

export default App
