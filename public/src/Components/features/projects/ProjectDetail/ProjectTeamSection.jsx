import { useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { UserPlus } from "lucide-react";
import { getFullName } from "@/utils/helpers/tableHelpers";
import { NotAvailable } from "@/utils/components/Placeholder";
import UserAvatar from "@/utils/components/UserAvatar";

// Riga label/valore usata nella card "Riepilogo team" della sidebar
const SummaryRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-b-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] text-right text-sm font-medium text-slate-700">{children}</span>
  </div>
);

const ProjectTeamSection = ({
  selectedProject,
  users = [],
  projectAssignedUsers = [],
  selectedAssignUserId,
  setSelectedAssignUserId,
  onAssignUser,
  onRemoveUser,
  searchUser,
  setSearchUser,
}) => {
  const [sortOrder, setSortOrder] = useState("asc");

  // filtriamo gli utenti per mostrare solo quelli non ancora assegnati al progetto
  // e solo utenti user
  const availableUsers = users.filter(
    (u) =>
      !projectAssignedUsers.some(
        (assigned) => assigned.id === u.id || assigned.user_id === u.id,
      ) && u.role === "user",
  );

  const sortedAssignedUsers = useMemo(() => {
    const sorted = [...projectAssignedUsers].sort((a, b) =>
      getFullName(a).localeCompare(getFullName(b), "it", { sensitivity: "base" }),
    );
    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [projectAssignedUsers, sortOrder]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* COLONNA PRINCIPALE: gestione team */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Team</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Gestione team del progetto</h3>
            <p className="mt-1 text-sm text-slate-500">
              Assegna o rimuovi i tester che lavorano su questo progetto.
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-500">
            {projectAssignedUsers.length} assegnati
          </div>
        </div>

        {/* Assegna tester */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-900">Assegna tester</Label>
                <p className="text-xs text-slate-500">Aggiungi un nuovo tester al progetto</p>
              </div>

               
             
            </div>
             
           

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={selectedAssignUserId} onValueChange={setSelectedAssignUserId}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Seleziona utente" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {getFullName(u)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!selectedAssignUserId}
                onClick={onAssignUser}
                className="shrink-0 bg-emerald-500 text-white hover:bg-emerald-600"
              >
                Assegna
              </Button>
            </div>
          </div>
        </div>



        {/* Lista tester assegnati */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-slate-900">
            Tester assegnati ({projectAssignedUsers.length})
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Ordina per</span>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-8 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Nome A-Z</SelectItem>
                <SelectItem value="desc">Nome Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        
          {/*Cerca utente da assegnare*/}
            <div className="mt-2 max-w-sm">
              <Label htmlFor="searchUser" className="sr-only">
                Cerca utente
              </Label>
              <input
                id="searchUser"
                type="text"
                placeholder="Cerca utente..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
               />



            </div>

        <div className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
          {sortedAssignedUsers.length > 0 ? (
            sortedAssignedUsers.map((assignedUser, index) => {
              const assignedUserId = assignedUser.id ?? assignedUser.user_id;
              const assignedUserName = getFullName(assignedUser);
              const assignedUserEmail = assignedUser.email ?? `ID ${assignedUserId}`;

              return (
                <div
                  key={assignedUserId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={assignedUser} colorIndex={index} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-slate-900">{assignedUserName}</span>
                        <Badge className="border-none bg-blue-100 text-blue-700">Tester</Badge>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-500">{assignedUserEmail}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onRemoveUser(assignedUser)}
                  >
                    Rimuovi
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Nessun utente assegnato al progetto.
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR: riepilogo team */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Riepilogo team</h3>
        <div>
          <SummaryRow label="Tester assegnati">{projectAssignedUsers.length}</SummaryRow>
          <SummaryRow label="Responsabile">
            {selectedProject?.created_by ? getFullName(selectedProject.created_by) : <NotAvailable />}
          </SummaryRow>
          <SummaryRow label="Task completati dal team">
            <NotAvailable />
          </SummaryRow>
          <SummaryRow label="Ultima attività del team">
            <NotAvailable />
          </SummaryRow>
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamSection;
