import React from 'react'

import { useAuthContext } from '../context/Auth/AuthContext'
import { Box, Typography, Card, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'



const AdminSessions = () => {

    const { user } = useAuthContext();
    const navigate = useNavigate()


    return (
       
<div className="
"> admin sessions</div>
   
    )


}
 export default AdminSessions