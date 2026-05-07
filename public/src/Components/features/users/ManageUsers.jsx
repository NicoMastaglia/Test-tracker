import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users } from '../../../fake_data/data';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog } from "lucide-react"; // Icona per gestione utente
import ModalForUsers from './ModalForUsers';

const ManageUsers = () => {
  const { user: currentUser } = useAuth(); // Rinominato per non confonderlo con i dati in tabella
  const [selectedUser, setSelectedUser] = useState(null);

  // Funzione per colorare i badge in base al ruolo
  const getRoleBadge = (role) => {
    const styles = {
      superadmin: "bg-red-100 text-red-700 hover:bg-red-100 border-none",
      admin: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none",
      tester: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none",
    };
    return (
      <Badge className={styles[role.toLowerCase()] || "bg-slate-100 text-slate-700"}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="mx-auto my-8 max-w-[1200px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[100px] font-semibold text-slate-900">ID Utente</TableHead>
            <TableHead className="font-semibold text-slate-900">Nome</TableHead>
            <TableHead className="font-semibold text-slate-900">Email</TableHead>
            <TableHead className="font-semibold text-slate-900">Ruolo</TableHead>
            <TableHead className="text-right font-semibold text-slate-900">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((userItem) => (
            <TableRow key={userItem.id} className="group hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-mono text-xs text-slate-500">
                #{userItem.id}
              </TableCell>
              
              <TableCell className="font-medium text-slate-700">
                {userItem.name}
              </TableCell>
              
              <TableCell className="text-slate-600">
                {userItem.email}
              </TableCell>
              
              <TableCell>
                {getRoleBadge(userItem.role)}
              </TableCell>
              
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedUser(userItem)}
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
          user={selectedUser} 
          setModal={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default ManageUsers;