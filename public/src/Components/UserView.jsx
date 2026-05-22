import React from "react";
import { useAuth } from "../context/Auth/AuthContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import SessionDetail from "./features/sessions/SessionDetail";

const UserView = ({ sessions }) => {
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

export default UserView;
