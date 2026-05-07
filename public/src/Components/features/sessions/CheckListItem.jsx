import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, X, Check, Trash2 } from "lucide-react"; // Icone più moderne

const CheckListItem = ({
  item,
  changeStatus,
  deleteItem,
  modal,
  selectedTask,
  modifyTask,
  setModal,
  setSelectedTask,
}) => {
  // --- STATO EDITING (Inline) ---
  if (modal && selectedTask && selectedTask.id === item.id) {
    return (
      <TableRow key={item.id} className="bg-slate-50/50">
        <TableCell colSpan={5} className="p-6">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Modifica Task <span className="text-emerald-600">#{item.id}</span>
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Descrizione Task</label>
              <Input
                value={selectedTask.description}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, description: e.target.value })
                }
                className="focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Note</label>
              <Textarea
                rows={3}
                value={selectedTask.note}
                onChange={(e) =>
                  setSelectedTask({ ...selectedTask, note: e.target.value })
                }
                className="focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setModal(false)}>
                Annulla
              </Button>
              <Button 
                onClick={() => modifyTask(item.id)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Salva Modifiche
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  // --- STATO VISUALIZZAZIONE ---
  return (
    <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
      <TableCell className="font-mono text-xs text-slate-500">#{item.id}</TableCell>
      
      <TableCell className="font-medium text-slate-700">
        {item.description}
      </TableCell>

      <TableCell>
        {!item.is_tested ? (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            Pending
          </Badge>
        ) : item.outcome === "pass" ? (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
            Passed
          </Badge>
        ) : (
          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-none">
            Failed
          </Badge>
        )}
      </TableCell>

      <TableCell className="max-w-[200px] truncate text-slate-500 italic">
        {item.note || "---"}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {/* CHECKBOX PASS (Emerald) */}
          <Checkbox
            checked={item.is_tested && item.outcome === "pass"}
            onCheckedChange={(checked) =>
              changeStatus(item.id, checked ? "pass" : "pending")
            }
            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          />

          {/* FAIL BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changeStatus(item.id, "fail")}
            className={item.outcome === "fail" ? "text-red-600 bg-red-50" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* EDIT BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedTask(item);
              setModal(true);
            }}
            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* DELETE BUTTON (Opzionale, l'ho aggiunto perché c'era nel commento) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteItem(item.id)}
            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CheckListItem;