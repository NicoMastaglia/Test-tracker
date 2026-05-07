import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; // Assicurati di averlo installato
import { Eye } from "lucide-react"; // Per un tocco pro al link

const SessionDetail = ({ sessions, user }) => {
  
  // 1. Filtriamo le sessioni in base al ruolo a monte del JSX
  const displayedSessions = user.role === 'superadmin' 
    ? sessions 
    : sessions.filter(s => s.user_id === user.id);

  // 2. Funzione per decidere lo stile del Badge (senza scrivere CSS inline)
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">In Progress</Badge>;
      case "not_started":
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <TableBody>
      {displayedSessions.length > 0 ? (
        displayedSessions.map((session) => (
          <TableRow key={session.id} className="group transition-colors hover:bg-slate-50/50">
            <TableCell className="font-mono text-xs text-slate-500">
              #{session.id}
            </TableCell>
            
            <TableCell className="font-medium text-slate-700">
              Progetto {session.project_id}
            </TableCell>
            
            <TableCell>
              {getStatusBadge(session.status)}
            </TableCell>
            
            <TableCell className="text-right">
              <Link
                to={`/sessions/${session.id}`}
                className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-blue-600 transition-colors hover:text-blue-800"
              >
                <Eye className="h-4 w-4" />
                View
              </Link>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center text-slate-500 italic">
            No sessions assigned.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default SessionDetail;