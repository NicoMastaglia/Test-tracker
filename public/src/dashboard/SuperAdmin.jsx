import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Users, PlayCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const SuperAdminDashboard = () => {

    const { user } = useAuth();
    const navigate = useNavigate();


    return (

        <div className="p-6 space-y-6">
   
   
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Progetti Attivi</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">qui vediamo il numero di progetti attivi</div>
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
            <p className="text-xs text-muted-foreground">numero tester attivi atm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessioni finite</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">xxx</div>
            <p className="text-xs text-emerald-500">+15% rispetto a ieri o ??...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utenti Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">totali utenti</div>
            <p className="text-xs text-muted-foreground"> stats es 4 nuovi nell'ultima settimana</p>
          </CardContent>
        </Card>
      </div>

      {/* Sezione Attività Recente o Progetti Prioritari */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7 mt-6">
         <Card className="col-span-4">
            <CardHeader>
               <CardTitle>Attività Recente  : Audit LOG</CardTitle>
            </CardHeader>
            <CardContent>
            
               <p className="text-sm text-slate-500 italic">Storico di tytte le attività</p>
            </CardContent>
         </Card>
         
         <Card className="col-span-3">
            <CardHeader>
               <CardTitle>Accessi Rapidi o eventuali tool  </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <Button variant="outline" className="justify-start">Crea nuovo report</Button>
               <Button variant="outline" className="justify-start">Gestisci permessi admin</Button>
               <Button variant="outline" className="justify-start text-red-500 hover:text-red-600">Manutenzione sistema</Button>
            </CardContent>
         </Card>
      </div>
    </div>
       


        

    )


}

export default SuperAdminDashboard;