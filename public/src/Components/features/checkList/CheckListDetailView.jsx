import { ClipboardList, ListTodo, Plus } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { TableRow, TableCell } from "@/Components/ui/table";
import StandardTable from "@/utils/StandardTable";

const TASK_HEADERS = [
  { key: "id",          label: "ID",      className: "w-20 font-semibold text-white text-center" },
  { key: "title",       label: "Task",    className: "font-semibold text-white" },
  { key: "status",      label: "Stato",   className: "font-semibold text-white text-center" },
  { key: "description", label: "Dettagli",className: "font-semibold text-white" },
  { key: "actions",     label: "Azioni",  className: "w-20 font-semibold text-white text-center" },
];

const CheckListDetailView = ({ checklist, project, isAdmin, onAddTask }) => {
  const taskItems =
    checklist?.tasks ?? checklist?.items ?? checklist?.checklist_items ?? [];

  return (
    <div className="space-y-6">
      {/* header card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Template checklist
                </p>
                <h2 className="text-2xl font-bold text-slate-900">{checklist.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Progetto:{" "}
                  <span className="font-medium text-slate-700">
                    {project?.name ?? `Progetto #${checklist.project_id}`}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="border-none bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                {project?.status ?? "N/D"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Checklist</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{checklist.title}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Progetto</p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {project?.name ?? `Progetto #${checklist.project_id}`}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Task</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{taskItems.length} task</p>
            </div>
          </div>
        </div>
      </div>

      {/* task table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Task checklist
            </h3>
          </div>
          {isAdmin && (
            <Button
              size="sm"
              onClick={onAddTask}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-7 px-2.5 text-xs"
            >
              <Plus className="h-3 w-3" />
              Add Task
            </Button>
          )}
        </div>

        <StandardTable
          headers={TASK_HEADERS}
          data={taskItems}
          emptyMessage="Nessuna task trovata per questa checklist."
          containerClass=""
          renderRow={(task, idx) => (
            <TableRow key={task.id ?? task.task_id ?? idx} className="group transition-colors hover:bg-slate-50">
              <TableCell className="font-mono text-slate-500 text-center">
                #{task.id ?? task.task_id ?? idx + 1}
              </TableCell>
              <TableCell className="font-semibold text-slate-900">
                {task.title ?? task.name ?? "Task senza titolo"}
              </TableCell>
              <TableCell className="text-slate-700 text-center">
                {task.status ?? "Da fare"}
              </TableCell>
              <TableCell className="max-w-xs truncate text-slate-600">
                {task.description ?? task.note ?? "—"}
              </TableCell>
              <TableCell className="text-center text-slate-400">—</TableCell>
            </TableRow>
          )}
        />
      </div>
    </div>
  );
};

export default CheckListDetailView;
