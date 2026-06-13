import AppRouter from './Router/AppRouter.jsx'
import './App.css'
import {users} from './fake_data/data.js'
import {useEffect} from "react";
import { Toaster } from 'sonner';
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
      <Toaster richColors position='top-center' />
      
    </>
  )
} 

export default App
