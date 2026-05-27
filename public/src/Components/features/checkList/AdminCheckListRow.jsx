import react from 'react';
import React from 'react';
import { TableRow, TableCell } from "@/Components/ui/table";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2, UserPlus, Flag } from "lucide-react";



const AdminCheckListRow = ({
    checklist}) => {

    return(
        <>
            {
             checklist.map((checklistItem) => (
                <TableRow key={checklistItem.id} className={`group transition-colors hover:bg-slate-50 `}>
                  <TableCell className="font-mono text-slate-500">#{checklistItem.id}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{checklistItem.project_id}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{checklistItem.title}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{checklistItem.updated_at}</TableCell>
                    <TableCell>
                        <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-blue-600" onClick={(e) => { e.stopPropagation(); /* openEditDialog(project); */ }}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); /* setDeleteProjectTarget(project); */ }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>)
            )
        
        }
    
        </>
    )

}

export default AdminCheckListRow; 



