import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge"; 
import { Eye } from "lucide-react"; 

const SessionDetail = ({ sessions, user }) => {
  
  
  const displayedSessions = user?.role === 'superadmin' 
    ? sessions 
    : sessions.filter(s => s?.user_id === user?.id);

  // 2. Badge stilizzati in linea con il design system (morbidi e senza contrasti acidi)
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
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200/60 shadow-sm rounded-md font-semibold px-2 py-0.5 text-[11px]">
            Completed
          </Badge>
        );
      case "in_progress":
      case "in_corso":
      case "ongoing":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200/60 shadow-sm rounded-md font-semibold px-2 py-0.5 text-[11px]">
            In Progress
          </Badge>
        );
      case "not_started":
      case "non_iniziato":
      case "da_iniziare":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200/60 shadow-sm rounded-md font-semibold px-2 py-0.5 text-[11px]">
            Not Started
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-slate-500 border-slate-200 text-[11px]">
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
            className="group transition-colors hover:bg-slate-50/60 border-b border-slate-100"
          >
            {/* ID Sessione in formato compatto */}
            <TableCell className="font-mono text-[11px] font-semibold text-slate-400 w-20">
              #{session.id}
            </TableCell>
            
            {/* Nome del Progetto o Fallback */}
            <TableCell className="font-semibold text-xs text-slate-700">
              {session.project_name || `Progetto ${session.project_id}`}
            </TableCell>
            
            {/* Badge dello Stato */}
            <TableCell>
              {getStatusBadge(session.status)}
            </TableCell>
            
            {/* Pulsante d'Azione pulito ed elegante a destra */}
            <TableCell className="text-right">
              <Link
                to={`/sessions/${session.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 px-2.5 py-1.5 rounded-lg transition-all"
              >
                <Eye className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span>Vedi dettagli</span>
              </Link>
            </TableCell>
          </TableRow>
        ))
      ) : (
        /* Stato vuoto coerente con la dashboard */
        <TableRow>
          <TableCell colSpan={4} className="h-32 text-center text-xs font-medium text-slate-400 bg-white">
            <span className="inline-block bg-slate-50 border border-slate-100/80 rounded-full px-4 py-2 italic">
              Nessuna sessione di test assegnata o trovata.
            </span>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default SessionDetail;
