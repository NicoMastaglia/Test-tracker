import React from "react";
import { Card, CardContent } from "@/Components/ui/card";

// componente   utilizzato nella dashboard per mostrare metriche 
export const KpiCard = ({ title, value, subtext, icon, iconClass }) => {
  const Icon = icon;
  return (
    <Card className="border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-start gap-4 pt-6">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex flex-col items-start text-left gap-2">
          <p className="text-[30px] leading-none text-slate-900">{value}</p>
          <p className="text-sm text-slate-500">{title}</p>
          {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
