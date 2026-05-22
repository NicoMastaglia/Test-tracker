import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Bug, ArrowRight } from "lucide-react"; // Icone per dare contesto

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Card Task Assegnate */}
        <Card className="border-t-4 border-t-blue-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-600">Le mie task</CardTitle>
                <CardDescription>Visualizza i task assegnati e le scadenze imminenti.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/sessions-test')} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 group"
            >
              APRI TASK
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Card Bug Report */}
        <Card className="border-t-4 border-t-purple-600 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Bug className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-600">Bug Report</CardTitle>
                <CardDescription>Invia una segnalazione per un problema riscontrato.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 group"
            >
              INVIA SEGNALAZIONE
              <Bug className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default UserDashboard;
