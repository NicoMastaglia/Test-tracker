import React from "react";
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
import { ClipboardList, ListTodo } from "lucide-react";
import {useAuthContext} from "@/context/Auth/AuthContext";
const CheckListInfoCard = ({ checklistItems = [],  selectedProject, onCreateChecklist }) => {
  const {user} = useAuthContext();
  const activeChecklist = checklistItems?.[0] ?? null;
  const taskItems =
    activeChecklist?.tasks ?? activeChecklist?.items ?? activeChecklist?.checklist_items ?? [];

  if (!activeChecklist) {
    return (
      <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <ClipboardList className="h-7 w-7" />
          </div>

          
          <div className="space-y-2">
            {user.role === "user" ? (
              <>
                <h2 className="text-lg font-semibold text-slate-900">Nessuna checklist assegnata</h2>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-slate-900">Nessuna checklist trovata</h2>
                
                <Button onClick={onCreateChecklist} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  Crea template checklist
                 </Button>
                
              </>
            )}
          </div>


          
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-300 space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Template checklist</p>
                <h2 className="text-2xl font-bold text-slate-900">{activeChecklist.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Progetto: <span className="font-medium text-slate-700">{selectedProject?.name ?? `Project ${activeChecklist.project_id}`} </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="border-none bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Stato progetto: {selectedProject?.status  ?? "N/D"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Checklist</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{activeChecklist.title}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Progetto</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{selectedProject?.name ?? `Project ${activeChecklist.project_id}`}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Task</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{taskItems.length} task collegate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <ListTodo className="h-5 w-5 text-slate-500" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Task checklist</h3>
        </div>

        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow className="bg-slate-900 hover:bg-slate-900 text-center">
              <TableHead className="w-25 font-bold text-white text-center">ID</TableHead>
              <TableHead className="font-bold text-white text-center">Task</TableHead>
              <TableHead className="font-bold text-white text-center">Stato</TableHead>
              <TableHead className="font-bold text-white text-center">Dettagli</TableHead>
              <TableHead className="font-bold text-white text-center">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskItems.length > 0 ? (
              taskItems.map((taskItem) => (
                <TableRow key={taskItem.id ?? taskItem.task_id ?? taskItem.title} className="group transition-colors hover:bg-slate-50">
                  <TableCell className="font-mono text-slate-500">#{taskItem.id ?? taskItem.task_id}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{taskItem.title ?? taskItem.name ?? "Task senza titolo"}</TableCell>
                  <TableCell className="text-slate-700">{taskItem.status ?? "Da fare"}</TableCell>
                  <TableCell className="text-slate-600">{taskItem.description ?? taskItem.note ?? "Nessun dettaglio disponibile."}</TableCell>
                  <TableCell className="text-center text-slate-400">—</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Nessuna task trovata.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CheckListInfoCard;
