import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import AdminCheckListRow from './AdminCheckListRow';







const AdminCheckListTable = ({ checklistItems = [] }) => {
  if (!checklistItems || checklistItems.length === 0) {
    return (
      <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <h2 className="text-center text-slate-500 py-8">Nessuna checklist trovata.</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto my-8 max-w-300 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow className="bg-slate-900 hover:bg-slate-900 text-center">
            <TableHead className="w-25 font-bold text-white text-center">ID</TableHead>
            <TableHead className="font-bold text-white text-center">project_id</TableHead>
            <TableHead className="font-bold text-white text-center">title</TableHead>
            <TableHead className="font-bold text-white text-center">last updated</TableHead>
            <TableHead className="font-bold text-white text-center">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checklistItems.map((item) => (
            <AdminCheckListRow key={item.id || item._id || item.title} checklist={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCheckListTable;
