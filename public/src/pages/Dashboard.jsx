import React from "react";
import { currentUser,sessions } from "../fake_data/data";
import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";
import { Card, Typography, Button } from "@mui/material"
import UserView from "@/Components/UserView";
import Sidebar from "@/Components/layout/Sidebar";
import {Box} from "@mui/material";
import AdminDashboard from "@/dashboard/Admin";
import SuperAdminDashboard from "@/dashboard/SuperAdmin";
import UserDashboard from "@/dashboard/User";
import AppLayout from "@/Components/layout/AppLayout";
import Header from "@/Components/layout/Header";

const DashBoard = () =>{

    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const dashBoardRules = {
      'user':  <UserDashboard/>,
      'admin' : <AdminDashboard/>,
      'superadmin' : <SuperAdminDashboard navigate={navigate}/>
    }
  
    console.log("User role in Dashboard:", user.role);

    
 
    return (
      <>

      <AppLayout page="dashboard">
       
        {dashBoardRules[user.role]}
      </AppLayout>
     
        </>


    )
}

export default DashBoard;