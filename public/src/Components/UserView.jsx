import React from "react";
import { useAuthContext } from "../context/Auth/AuthContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
} from "@/Components/ui/table";
import SessionDetail from "./features/sessions/SessionDetail";

const UserView = ({ sessions }) => {
  const { user } = useAuthContext();

  return (
    <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="text-center font-bold text-slate-900 w-30">Session #</TableHead>
            <TableHead className="text-center font-bold text-slate-900">Project #</TableHead>
            <TableHead className="text-center font-bold text-slate-900">Status</TableHead>
            <TableHead className="text-center font-bold text-slate-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <SessionDetail sessions={sessions} user={user} />
      </Table>
    </div>
  );
};

export default UserView;
