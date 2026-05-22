import { Box, Typography } from "@mui/material";
import Sidebar from "@/Components/layout/Sidebar";
import {sessions} from "../fake_data/data";
import { useNavigate } from "react-router-dom";
import UserView from "@/Components/UserView";
import AppLayout from "@/Components/layout/AppLayout";
const Sessions = () => {
    return(

      <>

      <AppLayout page="sessions">
        <UserView sessions={sessions}   />
      </AppLayout>

      </>


    )

}

export default  Sessions;
