import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Folder, PlayCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {


    return(
           <div className="p-6 space-y-6">
          
          
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium">Progetti Attivi</CardTitle>
                   <Folder className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">Numero progetti gestiti dall'admin</div>
                   <p className="text-xs text-muted-foreground"> es  +2 mese precedente </p>
                 </CardContent>
               </Card>
       
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium">Sessioni in Corso</CardTitle>
                   <PlayCircle className="h-4 w-4 text-amber-500" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">n sessioni in corso </div>
                   <p className="text-xs text-muted-foreground">numero user attivi atm</p>
                 </CardContent>
               </Card>
       
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium">12 checklist aggiornate oggi</CardTitle>
                   <CheckCircle className="h-4 w-4 text-emerald-500" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">12 checklist aggiornate oggi</div>
                   <p className="text-xs text-emerald-500">...</p>
                 </CardContent>
               </Card>
       
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium">Team Attivo</CardTitle>
                   <Users className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">8 user assegnati</div>
                   <p className="text-xs text-muted-foreground">non vede tutti quelli del sistema</p>
                 </CardContent>
               </Card>
             </div>
       
             {/* Sezione Attività Recente o Progetti Prioritari */}
             <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-6">
                <Card className="col-span-4">
                   <CardHeader>
                      <CardTitle>Attività recenti dei progetti</CardTitle>
                   </CardHeader>
                   <CardContent>
                   
                      <p className="text-sm text-slate-500 italic">Storico di tytte le attività</p>
                   </CardContent>
                </Card>
                
                <Card className="col-span-3">
                   <CardHeader>
                      <CardTitle>Quick Actions Admin</CardTitle>
                   </CardHeader>
                   <CardContent className="flex flex-col gap-2">
                      <Button variant="outline" className="justify-start">Crea nuovo progetto</Button>
                      <Button variant="outline" className="justify-start">Assegna user</Button>
                       <Button variant="outline" className="justify-start">Gestisci checklist</Button>
                        <Button variant="outline" className="justify-start">Nuova sessione test</Button>

                      {/* <Button variant="outline" className="justify-start text-red-500 hover:text-red-600">Manutenzione sistema</Button> */}
                   </CardContent>
                </Card>
             </div>
           </div>
              
    )
}

export default AdminDashboard;


