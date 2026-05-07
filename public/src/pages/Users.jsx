import AppLayout from "@/Components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import ManageUsers from "@/Components/features/users/ManageUsers";




const Users = () => {

    return (
        <AppLayout page="users">
            <ManageUsers />


        </AppLayout>
    )
}
export default Users;