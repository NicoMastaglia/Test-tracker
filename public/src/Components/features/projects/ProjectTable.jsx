import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress"; // Componente Shadcn
import { sessions } from "../../../fake_data/data";

const ProjectTable = ({ data }) => {
  
  const calculateProgress = (project_id) => {
    const sessionByProject = sessions.filter(s => s.project_id === project_id);
    if (sessionByProject.length === 0) return 0;

    // Nota: nel tuo codice avevi 'passed', assicurati che il dato sia coerente
    const completedSessions = sessionByProject.filter(s => s.status === 'completed' || s.status === 'passed').length;
    return Math.round((completedSessions / sessionByProject.length) * 100);
  };

  return (
    <div className="mx-auto my-6 max-w-[1200px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          {/* Sostituiamo il verde fluo con un'intestazione elegante */}
          <TableRow className="bg-slate-900 hover:bg-slate-900">
            <TableHead className="text-white font-bold w-[100px]">Project #</TableHead>
            <TableHead className="text-white font-bold">Name</TableHead>
            <TableHead className="text-white font-bold">Status</TableHead>
            <TableHead className="text-white font-bold">Description</TableHead>
            <TableHead className="text-white font-bold w-[200px]">Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((project) => {
            const progressValue = calculateProgress(project.id);
            
            return (
              <TableRow key={project.id} className="group transition-colors hover:bg-slate-50">
                <TableCell className="font-mono text-slate-500">
                  #{project.id}
                </TableCell>
                
                <TableCell className="font-semibold text-slate-900">
                  {project.name}
                </TableCell>
                
                <TableCell>
                  <span className="capitalize px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {project.status}
                  </span>
                </TableCell>
                
                <TableCell className="max-w-xs truncate text-slate-600">
                  {project.description}
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Avanzamento</span>
                      <span>{progressValue}%</span>
                    </div>
                    {/* Progress di Shadcn */}
                    <Progress 
                      value={progressValue} 
                      className="h-2 bg-slate-100" 
                      // Se vuoi la barra verde come il tuo tema:
                      indicatorClassName="bg-emerald-500" 
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;