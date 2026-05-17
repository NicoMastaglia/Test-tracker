import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Users, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// 1. SOTTO-COMPONENTE RIUTILIZZABILE 
const KpiCard = ({ title, value, subtext, icon: Icon, subtextColor = "text-slate-400" }) => {
  return (
    <Card className="border-slate-100 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        <p className={`text-xs font-medium mt-1 ${subtextColor}`}>{subtext}</p>
      </CardContent>
    </Card>
  );
};

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Configurazione compatta dei dati per la griglia KPI
  const kpiItems = [
    {
      title: "Progetti Attivi",
      value: "0",
      subtext: "Nessun incremento questo mese",
      icon: Folder,
      subtextColor: "text-slate-400",
    },
    {
      title: "Sessioni in Corso",
      value: "0",
      subtext: "Nessun tester attivo al momento",
      icon: PlayCircle,
      subtextColor: "text-amber-500", 
    },
    {
      title: "Sessioni finite",
      value: "0",
      subtext: "Stabile rispetto a ieri",
      icon: CheckCircle,
      subtextColor: "text-emerald-500",
    },
    {
      title: "Utenti Totali",
      value: "0",
      subtext: "Nessun nuovo utente questa settimana",
      icon: Users,
      subtextColor: "text-slate-400",
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen">
      
      {/* GRIGLIA KPI CARD (Generata dinamicamente con il .map) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiItems.map((kpi, idx) => (
          <KpiCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            subtext={kpi.subtext}
            icon={kpi.icon}
            subtextColor={kpi.subtextColor}
          />
        ))}
      </div>

      {/* SEZIONE INFERIORE: AUDIT LOG & ACCESSI RAPIDI */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-100 shadow-sm bg-white flex flex-col">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">
              Attività Recente: Audit LOG
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-10">
            <p className="text-xs font-medium text-slate-400 italic bg-slate-50 px-4 py-2 rounded-full border border border-slate-100/60">
              Nessun log o attività registrata nello storico
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-100 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Accessi Rapidi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-4">
            <Button
              variant="outline"
              className="justify-start text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 h-9 px-3 rounded-lg transition-colors"
            >
              Crea nuovo report
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 h-9 px-3 rounded-lg transition-colors"
            >
              Gestisci permessi admin
            </Button>
            <Button
              variant="outline"
              className="justify-start text-xs font-semibold text-rose-600 border-rose-100 bg-rose-50/30 hover:bg-rose-50 hover:text-rose-700 h-9 px-3 rounded-lg transition-colors"
            >
              Manutenzione sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;