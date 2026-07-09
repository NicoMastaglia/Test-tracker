import React from 'react';
import { useNavigate } from "react-router-dom";
import { TableCell, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { UserCog, Users, Eye } from "lucide-react"; // Icona per gestione utente
import StandardTable from "@/utils/components/StandardTable";
import ModalForUsers from './ModalForUsers';
import { useUserContext } from "@/context/User/UserContext";
import { getFullName, getRoleInfo } from "@/utils/helpers/tableHelpers";
import UserAvatar from "@/utils/components/UserAvatar";
import { useAuthContext } from "@/context/Auth/AuthContext";

const HEADERS = [
  { key: "user", label: "Utente", className: "font-semibold text-foreground" },
  { key: "email", label: "Email", className: "font-semibold text-foreground" },
  { key: "role", label: "Ruolo", className: "font-semibold text-foreground" },
  { key: "actions", label: "Azioni", className: "w-24 font-semibold text-foreground" },
];

const ManageUsers = ({ data }) => {
  const { selectedUser, fetchUserById, clearSelectedUser } = useUserContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

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
      <StandardTable
        containerClass="overflow-x-auto"
        headers={HEADERS}
        data={data}
        emptyMessage="Nessun utente trovato."
        emptyIcon={Users}
        renderRow={(userItem) => (
          <TableRow
            key={userItem.id}
            className={`group transition-colors hover:bg-muted ${user.id === userItem.id ? "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15" : ""}`}
          >
            <TableCell className="text-left text-foreground">
              <div className="flex items-center justify-start gap-3">
                <UserAvatar user={userItem} size="sm" />
                <span className="font-semibold text-foreground">
                  {getFullName(userItem)}
                  {user.id === userItem.id ? <span className="font-normal text-muted-foreground"> (tu)</span> : ''}
                </span>
              </div>
            </TableCell>

            <TableCell className="text-center font-normal text-muted-foreground">
              {userItem.email}
            </TableCell>

            <TableCell className="text-center">
              {getRoleBadge(userItem.role)}
            </TableCell>

            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/users/${userItem.id}`)}
                  className="h-9 cursor-pointer rounded-lg px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Dettagli
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchUserById(userItem.id)}
                  className="h-9 cursor-pointer rounded-lg px-3 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10"
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Modifica
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

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
