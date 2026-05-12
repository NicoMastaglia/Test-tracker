import React from "react";
import { currentUser,sessions } from "../fake_data/data";
import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Typography, Button } from "@mui/material"
import TesterView from "@/Components/TesterView";
import Sidebar from "@/Components/layout/Sidebar";
import {Box} from "@mui/material";
import AdminDashboard from "@/dashboard/Admin";
import SuperAdminDashboard from "@/dashboard/SuperAdmin";
import TesterDashboard from "@/dashboard/Tester";
import AppLayout from "@/Components/layout/AppLayout";
import Header from "@/Components/layout/Header";

const DashBoard = () =>{

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const dashBoardRules = {
      'tester' :  <TesterDashboard/>,
      
      'admin' : <AdminDashboard/>,
      'superadmin' : <SuperAdminDashboard/>
    }
  
    console.log("User role in Dashboard:", user.role);

    // const navigate = useNavigate();
 
    return (
      <>

      <AppLayout page="dashboard">
       
        {dashBoardRules[user.role]}
      </AppLayout>
      {/* <Box sx={{ display: 'flex', minHeight: '100vh',margin: '0 auto',
        padding : '24px',maxWidth: '1200px'
      }}>
      <Sidebar  user={user} />
     <Box sx={{ p: 4, minHeight: '100vh'}}>
    

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ display: 'grid', gap: '24px' }}>

       {
        dashBoardRules[user.role]
       } */}
     

        {/* AZIONE INFO/STANDARD (BLU) */}
        {/* <Card sx={{
          p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '4px solid #1976d2', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <Typography variant="h6" sx={{ color: '#1976d2' }}>{user.role =='superadmin' ? 'Sessioni' : ' Le mie task'}</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>Visualizzazione dei task assegnati e scadenze.</Typography>
          <Button  onClick={ () => navigate('/sessions-test') }     variant="contained" sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}>
            Apri Task
          </Button>
        </Card> */}

        {/* AZIONE DI GESTIONE/TEAM (AZZURRO/CYAN) */}
        {/* {(user.role === 'admin' || user.role === 'superadmin') && (
          <Card sx={{
            p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '4px solid #0288d1', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h6" sx={{ color: '#0288d1' }}>Gestione Team</Typography>
            <Button variant="outlined" sx={{ color: '#0288d1', borderColor: '#0288d1' }}>
              Assegna Task
            </Button>
          </Card>
        )} */}

        {/* AZIONE CRITICA/PERICOLO (ROSSO) */}
        {/* {user.role === 'superadmin' && ( */}
          <>
            {/* <Card sx={{
              p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '4px solid #d32f2f', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#d32f2f' }}>Pannello Sistema</Typography>
              <Button variant="contained" sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}>
                Elimina Log
              </Button>
            </Card>

            {/* AZIONE NEUTRA/CONFIGURAZIONE (GRIGIO SCURO) */}
            {/* <Card sx={{
              p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '4px solid #455a64', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#455a64' }}>Gestione Utenti</Typography>
              <Button   onClick={ () => navigate('/manage-users') }variant="contained" sx={{ bgcolor: '#455a64', '&:hover': { bgcolor: '#37474f' } }}>
                Modifica Permessi
              </Button>
            </Card>

            {/* AZIONE POSITIVA/CREAZIONE (VERDE) */}
            {/* <Card sx={{
              p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '4px solid #2e7d32', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#2e7d32' }}>Nuovo Progetto</Typography>
              <Button variant="contained" sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
                Crea Ora
              </Button>
            </Card>

            <Card sx={{
              p: 3, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '4px solid #ed6c02', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ color: '#ed6c02' }}>CheckList</Typography>
              <Button variant="contained" sx={{ bgcolor: '#ed6c02', '&:hover': { bgcolor: '#e65100' } }}>
                Gestisci Lista
              </Button>
            </Card>  */}
          </>
        {/* )} */}

        {/* AZIONE TEST/BUG (VIOLA) */}
       
      {/* </div>
    </Box>
        </Box> */}
        </>


    )
}

export default DashBoard;