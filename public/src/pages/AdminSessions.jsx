import React from 'react'
import SessionsTests from './SessionsTests'
import { useAuth } from '../context/AuthContext'
import { Box, Typography, Card, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import AppLayout from './AppLayout'

const AdminSessions = () => {

    const { user } = useAuth();
    const navigate = useNavigate()


    return (
       <h1>ddd</h1>

   
    )


}
 export default AdminSessions