import React from "react";
import { useAuth } from "../context/Auth.js/AuthContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import SessionDetail from "./features/sessions/SessionDetai";

const TesterView = ({ sessions }) => {
  const { user } = useAuth();

  return (
    <div className="mx-auto my-6 max-w-[1200px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          {/* Usiamo un'intestazione scura coerente con le altre tabelle o emerald per richiamare il tuo brand */}
          <TableRow className="bg-slate-900 hover:bg-slate-900">
            <TableHead className="text-white font-bold w-[120px]">Session #</TableHead>
            <TableHead className="text-white font-bold">Project #</TableHead>
            <TableHead className="text-white font-bold">Status</TableHead>
            <TableHead className="text-white font-bold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        {/* SessionDetail contiene già il <TableBody> convertito */}
        <SessionDetail sessions={sessions} user={user} />
      </Table>
    </div>
  );
};

export default TesterView;
 
 
 // <div>
        //     <h1>Dashboard</h1>
        //     <h2>Benvenuto, {currentUser.role}  {currentUser.id}</h2>
        //     <h3>Sessioni Asssegnate</h3>
            

        //     <TableContainer component={Paper}>
        //     <Table>
        //         <TableHead>
        //             <TableRow style={{backgroundColor:'#00E754',
                      
        //             }}
        //             >
        //                 <TableCell>Session ID</TableCell>
        //                 <TableCell>Project ID</TableCell>
        //                 <TableCell>Status</TableCell>
        //                 <TableCell>Actions</TableCell>

        //             </TableRow>
        //         </TableHead>
        //         <TableBody>
        //             {currentUser.role === "tester" ? (
        //                sessions.filter(s=>s.user_id === currentUser.id).map((session) => (
        //                     <TableRow key={session.id}>
        //                         <TableCell>{session.id}</TableCell>
        //                         <TableCell>{session.project_id}</TableCell>
        //                         <TableCell>{session.status}</TableCell>
        //                         <TableCell><Link
        //                         style={{textDecoration:'None',
        //                             fontWeight:'600',
        //                             textTransform:'uppercase',
        //                             color:'#1976d2'
        //                         }}
        //                         to={`/sessions/${session.id}`}>View</Link></TableCell>
        //                     </TableRow>
        //                 ))
        //             ) : 
        //             <TableRow>
        //                 <TableCell colSpan={3} align="center">
        //                     No sessions assigned.
        //                 </TableCell>
        //             </TableRow>
        //             }
                            
               
        //         </TableBody>
        //     </Table>
        //     </TableContainer>
        // </div>