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
        <TableHeader className="bg-slate-900">
          <TableRow className="bg-slate-900 hover:bg-slate-900">
            <TableHead className="text-center font-bold text-white w-30">Session #</TableHead>
            <TableHead className="text-center font-bold text-white">Project #</TableHead>
            <TableHead className="text-center font-bold text-white">Status</TableHead>
            <TableHead className="text-center font-bold text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <SessionDetail sessions={sessions} user={user} />
      </Table>
    </div>
  );
};

export default UserView;
