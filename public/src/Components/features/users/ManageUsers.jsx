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
import { getFullName, getRoleInfo } from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import { useAuthContext } from "@/context/Auth/AuthContext";
const ManageUsers = ({ data }) => {
  const { selectedUser, fetchUserById, clearSelectedUser } = useUserContext();
  const { user } = useAuthContext();

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
    <>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow  className={`bg-slate-50 hover:bg-slate-50 text-center`}>
            <TableHead className="w-24 font-semibold text-slate-900 text-center">ID</TableHead>
            <TableHead className="font-semibold text-slate-900 text-center">Utente</TableHead>
            <TableHead className="font-semibold text-slate-900 text-center">Email</TableHead>
            <TableHead className="font-semibold text-slate-900 text-center">Ruolo</TableHead>
            <TableHead className="w-24 font-semibold text-slate-900 text-center">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {/* volendo si può creare un componente UserRow per semplificare */}
          {data.length > 0 ? (
            data.map((userItem) => (
              <TableRow key={userItem.id}

              className={`group transition-colors hover:bg-slate-50 ${user.id === userItem.id ? "bg-emerald-50 hover:bg-emerald-100" : ""}`}>
                <TableCell className="font-mono text-xs text-slate-400">
                  #{userItem.id}
                </TableCell>

                <TableCell className="text-slate-900">

                  <div className="flex items-center gap-3">
                    <UserAvatar user={userItem} colorIndex={userItem.id} size="sm" />
                    <span>{getFullName(userItem)}{user.id== userItem.id ? ' (tu)' : ''}</span>
                  </div>


                </TableCell>

                <TableCell className="text-slate-500">
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
    </div>

    {/* Modal/Dialog per la modifica */}
    {selectedUser && (
      <ModalForUsers
        key={selectedUser.id}
        clearSelectedUser={clearSelectedUser}
      />
    )}
    </>
  );
};

export default ManageUsers;