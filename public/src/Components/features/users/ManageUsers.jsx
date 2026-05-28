import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { UserCog } from "lucide-react"; // Icona per gestione utente
import ModalForUsers from './ModalForUsers';
import { useUserContext } from "@/context/User/UserContext";
import { getFullName, getInitials, getRoleInfo } from "@/utils/tableHelpers";

const ManageUsers = ({ data }) => {
  const { selectedUser, fetchUserById, clearSelectedUser } = useUserContext();

  const getRoleBadge = (role) => {
    const roleInfo = getRoleInfo(role);

    return (
      <Badge className={`border-none px-3 py-1 text-xs ${roleInfo.className}`}>
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />
        {roleInfo.label}
      </Badge>
    );
  };

  return (
    <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="bg-slate-900 hover:bg-slate-900 text-center">
            <TableHead className="w-24 font-semibold text-white text-center">ID</TableHead>
            <TableHead className="font-semibold text-white text-center">Utente</TableHead>
            <TableHead className="font-semibold text-white text-center">Email</TableHead>
            <TableHead className="font-semibold text-white text-center">Ruolo</TableHead>
            <TableHead className="w-24 font-semibold text-white text-center">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((userItem) => (
              <TableRow key={userItem.id} className="group transition-colors hover:bg-slate-50">
                <TableCell className="font-mono text-xs text-slate-500">
                  #{userItem.id}
                </TableCell>
                
                <TableCell className="text-slate-900 ">
                  
                  
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{getFullName(userItem)}</p>
                    
                 
                  </div>
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
                    className="h-9 rounded-lg px-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Modifica
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                Nessun utente trovato.
              </TableCell>
            </TableRow>
          )}
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