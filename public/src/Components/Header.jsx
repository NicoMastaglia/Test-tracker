import  {Box, Typography} from "@mui/material";
import Sidebar from "@/Components/layout/Sidebar";
import AdminDashboard from "../Admin";
import TesterDashboard from "../TesterDashboard";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";





const Header = ({user,page}) =>{


const headerConfig = {
  dashboard: {
    title: (user) => `Benvenuto, ${user.name}!`,
    subtitle: (user) => `Ruolo: ${user.role} `
  },
  projects: {
    title: () => 'Gestione Progetti',
    subtitle: () => 'Crea, modifica e assegna progetti ai tester.'
  },
    sessions: {
    title: () => 'Gestione Sessioni',
    subtitle: () => 'Visualizza e gestisci le sessioni di test.'

    },
    users: {
      title: () => 'Gestione Utenti',
      subtitle: () => 'Visualizza e gestisci gli utenti della piattaforma.'
    }

};
    return (

           
           
           <Box className="header" style={{ display: 'flex', flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center' ,marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
           <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
                {headerConfig[page].title(user)}
        </Typography><Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
               {headerConfig[page].subtitle(user)}
            </Typography>
            </Box>

           
            

    )

   

}

export default Header;