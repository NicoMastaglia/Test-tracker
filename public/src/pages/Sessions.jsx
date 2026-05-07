import { Box, Typography } from "@mui/material";
import Sidebar from "@/Components/layout/Sidebar";
import {sessions} from "../fake_data/data";
import { useNavigate } from "react-router-dom";
import TesterView from "@/Components/TesterView";
import AppLayout from "@/Components/layout/AppLayout";
const Sessions = () => {
    // const navigate = useNavigate();

    return(

      <>

      <AppLayout page="sessions">
        <TesterView sessions={sessions}   />
      </AppLayout>

      </>



    //     <>
    //     <Box sx={{ display: 'flex', minHeight: '100vh',
          
    //     }}>
    //     <Sidebar />
        
    //    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh',flexGrow:1}}>
    //     <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
    //       Gestione Sessioni
    //     </Typography>
    //     <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
    //       Visualizza e gestisci tutte le sessioni di test.
    //     </Typography>
    //     {/* <Typography variant="body1" sx={{ color: '#666' }}>
    //       Qui puoi monitorare lo stato delle sessioni, assegnare tester e visualizzare i risultati dei test.
    //     </Typography> */}

    //     <TesterView sessions={sessions}  />

    //     {/* {
    //         sessions.map((session) => (
    //             <Box key={session.id} sx={{ p: 2, mb: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    //                 <Typography variant="h6" sx={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate(`/sessions/${session.id}`)}>
    //                     Sessione ID: {session.id} - {session.name || "N/A"}
    //                 </Typography>
    //                 <Typography variant="body2" sx={{ color: '#666' }}>Project ID: {session.project_id}</Typography>
    //                 <Typography variant="body2" sx={{ color: '#666' }}>User ID: {session.user_id}</Typography>
    //                 <Typography  variant="body2" sx={{ color: '#666' }}>Status: {session.status}</Typography>
    //             </Box>
    //         ))
    //     } */}
    //    </Box>
    //  </Box>
    //   </>
    )










}

export default  Sessions;