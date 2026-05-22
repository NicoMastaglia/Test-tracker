import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/Auth/AuthContext';
import { Table, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody } from '@mui/material';




const TableBodyComponent = ({rows}) =>{



return (
    <TableBody>
        {rows.map((row) => (
            <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.project_id}</TableCell>
                <TableCell>{row.status}</TableCell>
            </TableRow>
        ))}
    </TableBody>



) 



}

export default TableBodyComponent;