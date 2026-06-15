import React from "react";
import { Link } from "react-router-dom";
import { TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge"; 
import { Eye } from "lucide-react"; 

const SessionDetail = ({ sessions, user }) => {
  
  
  const displayedSessions = user?.role === 'superadmin' 
    ? sessions 
    : sessions.filter(s => s?.user_id === user?.id);

  // 2. Badge stilizzati 
  // da modificare in base ai dati che arrivano dal be 
  const getStatusBadge = (status) => {
    const normalizedStatus = (status ?? "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    switch (normalizedStatus) {
      case "completed":
      case "completato":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-sm rounded-md font-semibold px-2 py-0.5 text-[11px]">
            Completed
          </Badge>
        );
      case "in_progress":
      case "in_corso":
      case "ongoing":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-sm rounded-md font-semibold px-2 py-0.5 text-[11px]">
            In Progress
          </Badge>
        );
      case "not_started":
      case "non_iniziato":
      case "da_iniziare":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200 shadow-sm rounded-md font-semibold px-2 py-0.5 text-[11px]">
            Not Started
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-600 border-slate-200 text-[11px]">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  return (
    <TableBody>
      {displayedSessions.length > 0 ? (
        displayedSessions.map((session) => (
          <TableRow
            key={session.id}
            className="group border-b border-slate-200 transition-colors hover:bg-slate-50"
          >
            <TableCell className="w-20 font-mono text-center text-[11px] font-semibold text-slate-400">
              #{session.id}
            </TableCell>

            <TableCell className="text-center text-xs font-semibold text-slate-900">
              {session.project_name || `Progetto ${session.project_id}`}
            </TableCell>

            <TableCell className="text-center">
              {getStatusBadge(session.status)}
            </TableCell>

            <TableCell className="text-center">
              <Link
                to={`/sessions/${session.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-transparent hover:bg-slate-100 hover:text-slate-900 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Eye className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                <span>Vedi dettagli</span>
              </Link>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center text-sm text-slate-500">
            Nessuna sessione di test assegnata o trovata.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default SessionDetail;
