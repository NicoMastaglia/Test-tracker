import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { getFullName, getInitials, getRoundColorClass } from "@/utils/tableHelpers";

const ProjectTeamSection = ({
    users = [],
    projectAssignedUsers = [],
    selectedAssignUserId,
    setSelectedAssignUserId,
    projectId,
    assignUserToProject,
    fetchProjectDetails,
    onRemoveUser,
}) => {
    // filtriamo gli utenti per mostrare solo quelli non ancora assegnati al progetto 
    // e solo utenti user 
    const availableUsers =  users.filter(u => 
        !projectAssignedUsers.some(assigned => assigned.id === u.id || assigned.user_id === u.id) && 
        u.role === "user"
    );
     
  
    console.log("Available users for assignment:", availableUsers);
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Team</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">Utenti del progetto</h3>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                    {projectAssignedUsers.length} assegnati
                </div>
            </div>

            <div className="mx-auto mt-5 w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Label>Assegna tester</Label>
                <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
                    <Select value={selectedAssignUserId} onValueChange={setSelectedAssignUserId}>
                        <SelectTrigger className="w-full sm:w-80">
                            <SelectValue placeholder="Seleziona utente" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableUsers.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)}>{getFullName(u)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        disabled={!selectedAssignUserId}
                        onClick={async () => {
                            if (!projectId || !selectedAssignUserId) return;
                            await assignUserToProject(Number(projectId), Number(selectedAssignUserId));
                            await fetchProjectDetails(Number(projectId));
                            setSelectedAssignUserId("");
                        }}
                        className="shrink-0 sm:w-auto"
                    >
                        Assegna
                    </Button>
                </div>
            </div>

            <div className="mt-5 max-h-80 space-y-3 overflow-y-auto pr-1">
                {projectAssignedUsers.length > 0 ? (
                    projectAssignedUsers.map((assignedUser, index) => {
                        const assignedUserId = assignedUser.id ?? assignedUser.user_id;
                        const assignedUserName = getFullName(assignedUser);
                        const assignedUserEmail = assignedUser.email ?? `ID ${assignedUserId}`;

                        return (
                            <div key={assignedUserId} className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${getRoundColorClass(index)}`}>
                                        {getInitials(assignedUser)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-slate-900">
                                            <span className="truncate">{assignedUserName}</span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-slate-500">{assignedUserEmail}</p>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
    );
};

export default ProjectTeamSection;