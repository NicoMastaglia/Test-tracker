import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog } from "lucide-react"; // Icona per gestione utente
import ModalForUsers from './ModalForUsers';
import { useUsersContext } from "@/context/User/UserContext";

const ManageUsers = ({ data }) => {
  const { selectedUser, fetchUserById, clearSelectedUser } = useUsersContext();



  // Funzione per colorare i badge in base al ruolo
  const getRoleBadge = (role) => {
    const styles = {
      user: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none",
      superadmin: "bg-red-100 text-red-700 hover:bg-red-100 border-none",
      admin: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none",
      
    };
    return (
      <Badge className={styles[role.toLowerCase()] || "bg-slate-100 text-slate-700"}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="mx-auto my-8 max-w-300 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="text-center">
            <TableHead className="w-25 font-semibold text-slate-900 text-center">ID Utente</TableHead>
            <TableHead className="font-semibold text-slate-900 text-center">Nome</TableHead>
            <TableHead className="font-semibold text-slate-900v text-center">Cognome</TableHead>
            <TableHead className="font-semibold text-slate-900 text-center">Email</TableHead>
            <TableHead className="font-semibold text-slate-900 texr-center">Ruolo</TableHead>
            <TableHead className=" font-semibold text-slate-900 text-center">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((userItem) => (
            <TableRow key={userItem.id} className="group hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-mono text-xs text-slate-500">
                #{userItem.id}
              </TableCell>
              
              <TableCell className="font-medium text-slate-700">
                {userItem.nome}
              </TableCell>

              <TableCell className="font-medium text-slate-700">
                {userItem.cognome}
              </TableCell>


              
              
              <TableCell className="text-slate-600">
                {userItem.email}
              </TableCell>
              
              <TableCell>
                {getRoleBadge(userItem.role)}
              </TableCell>
              
              <TableCell className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => fetchUserById(userItem.id)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal/Dialog per la modifica */}
      {selectedUser && (
        <ModalForUsers 
          key={selectedUser.id}
          clearSelectedUser={clearSelectedUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;