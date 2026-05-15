import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CheckListItem from "./CheckListItem";

const CheckListTable = ({
  lista,
  changeStatus,
  deleteItem,
  modifyTask,
  selectedTask,
  setSelectedTask,
  modal,
  setModal,
}) => {
  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[80px] font-semibold text-center">ID</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Description</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 text-center">Note</TableHead>
            <TableHead className="text-right font-semibold text-slate-700 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lista.length > 0 ? (
            lista.map((item) => (
              <CheckListItem
                key={item.id}
                item={item}
                changeStatus={changeStatus}
                deleteItem={deleteItem}
                modal={modal}
                selectedTask={selectedTask}
                modifyTask={modifyTask}
                setModal={setModal}
                setSelectedTask={setSelectedTask}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                Nessun elemento trovato nella checklist.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CheckListTable;