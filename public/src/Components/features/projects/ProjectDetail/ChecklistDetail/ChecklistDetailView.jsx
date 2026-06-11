import { ClipboardList, ListTodo, Plus } from "lucide-react";

import { Button } from "@/Components/ui/button";
import { TableRow, TableCell } from "@/Components/ui/table";
import StandardTable from "@/utils/StandardTable";
import TaskTable from "./TaskTable";
import ChecklistInfoCard from "./ChecklistInfoCard";
import ActionBar from "@/utils/ActionBar";



const ChecklistDetailView = ({ checklist, project, handleAdd, handleEdit, handleDelete, isAdmin,
  setSearch, search,setModal
 }) => {
  const taskItems =
    checklist?.tasks ?? checklist?.items ?? checklist?.checklist_items ?? [];






  return (
    <div className="flex flex-col gap-6">
      <ChecklistInfoCard checklist={checklist} selectedProject={project} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ActionBar search={search} setSearch={setSearch}
        placeholder="Cerca task.."
        buttonText={isAdmin ? "Crea Task" : null}
        buttonVariant="emerald"
        setModal={setModal}/>

        <TaskTable tasks={taskItems} handleDelete={handleDelete} handleEdit={handleEdit} isAdmin={isAdmin} />
      </div>

      {/* <StandardTable
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
        /> */}
    </div>
  );
};

export default ChecklistDetailView;
