import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PlayCircle, ChevronRight, ListChecks, FileSpreadsheet, FileText, RotateCcw, Trash2, SearchX } from "lucide-react";
import AppLayout from "@/Components/layout/AppLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import StandardTable from "@/utils/components/StandardTable";
import Loader from "@/utils/components/Loader";
import DeleteConfirmModal from "@/utils/components/DeleteConfirmModal";
import SessionTaskRow from "./SessionTaskRow";
import UpdateOutcomeModal from "./UpdateOutcomeModal";
import { useSessionContext } from "@/context/Session/SessionContext";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { getSessionStatusBadgeClass, formatProjectDateTime } from "@/utils/helpers/tableHelpers";
import { exportSessionToExcel, exportSessionToPdf } from "@/utils/helpers/exportSessionReport";
import { toast } from "sonner";

const BASE_HEADERS = [
  { label: "Task", key: "description" },
  { label: "Scadenza", key: "deadline" },
  { label: "Stato", key: "task_status" },
  { label: "Esito", key: "outcome" },
  { label: "Nota", key: "note" },
];
const ACTIONS_HEADER = { label: "Azioni", key: "actions" };

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { selectedSession, sessionTask, loading, fetchSessionsDetail, updateSessionTask, reopenTaskOutcome, reopenSession, deleteSession, clearSelectedSession } = useSessionContext();

  const [editingTask, setEditingTask] = useState(null);
  const [confirmReopenOpen, setConfirmReopenOpen] = useState(false);
  const [reopeningSession, setReopeningSession] = useState(false);
  const [reopenOutcomeTarget, setReopenOutcomeTarget] = useState(null);
  const [reopeningOutcome, setReopeningOutcome] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState(false);

  const isAdmin = user?.role !== "user";
  // back route e breadcrumb dipendono dal ruolo: l'admin arriva da /admin/sessions
  const backPath = isAdmin ? "/admin/sessions" : "/sessions-test";
  const backLabel = isAdmin ? "Torna alle sessioni" : "Torna alle sessioni";
  const listLabel = isAdmin ? "Sessioni" : "Sessioni";

  // distingue "non ancora caricata" da "caricata ma non trovata" (es. sessione
  // cancellata nel frattempo da un admin): senza questo flag il primo render,
  // prima che l'effect parta, mostrerebbe per un istante lo stato "non trovata"
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  useEffect(() => {
    setInitialFetchDone(false);
    fetchSessionsDetail(id).finally(() => setInitialFetchDone(true));
    return () => clearSelectedSession();
  }, [id]);

  const sessionNotFound = initialFetchDone && !loading && !selectedSession;

  // admin/superadmin possono solo visualizzare la sessione di un tester (sola lettura);
  // a progetto in pausa/completato anche il tester non può modificare (il BE lo rifiuta comunque).
  // Lo stato "Completata" della sessione NON rende più la vista sola lettura: un esito è
  // bloccato individualmente in base al proprio outcome (vedi SessionTaskRow), non allo
  //  (riaprire una task non sblocca anche le altre)
  const readOnly =
    isAdmin ||
    selectedSession?.project_status === "In pausa" ||
    selectedSession?.project_status === "Completato";

  const handleUpdateOutcome = async (outcome, note) => {
    try {
      await updateSessionTask(id, editingTask.checklist_item_id, { outcome, note });
      toast.success("Esito aggiornato");
      setEditingTask(null);
    } catch (error) {
      const message = error.response?.data?.error || "Errore durante l'aggiornamento dell'esito";
      toast.error(message);
    }
  };

  const handleConfirmReopenOutcome = async () => {
    if (!reopenOutcomeTarget) return;
    setReopeningOutcome(true);
    try {
      await reopenTaskOutcome(id, reopenOutcomeTarget.checklist_item_id);
      toast.success("Esito riaperto, ora puoi correggerlo");
      setReopenOutcomeTarget(null);
    } catch (error) {
      const message = error.response?.data?.error || "Errore durante la riapertura dell'esito";
      toast.error(message);
    } finally {
      setReopeningOutcome(false);
    }
  };

  const handleReopenSession = async () => {
    setReopeningSession(true);
    try {
      await reopenSession(id);
      await fetchSessionsDetail(id);
      toast.success("Sessione riaperta, il tester è stato avvisato via email");
      setConfirmReopenOpen(false);
    } catch (error) {
      const message = error.response?.data?.error || "Errore durante la riapertura della sessione";
      toast.error(message);
    } finally {
      setReopeningSession(false);
    }
  };

  const handleDeleteSession = async () => {
    setDeletingSession(true);
    try {
      await deleteSession(id);
      toast.success("Sessione eliminata con successo");
      navigate(backPath);
    } catch (error) {
      const message = error.response?.data?.error || "Errore durante l'eliminazione della sessione";
      toast.error(message);
    } finally {
      setDeletingSession(false);
    }
  };

  return (
    <AppLayout page="sessions">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
        {/* breadcrumb + back button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <button onClick={() => navigate(backPath)} className="cursor-pointer hover:text-foreground transition-colors">
              {listLabel}
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">
              Sessione #{id}{selectedSession?.project_name ? ` — ${selectedSession.project_name}` : ""}
            </span>
          </nav>

          <Button variant="ghost" size="sm" onClick={() => navigate(backPath)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
        </div>

        {selectedSession && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-emerald-500" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge className={`border-none px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center ${getSessionStatusBadgeClass(selectedSession.status)}`}>
                  {selectedSession.status}
                </Badge>
                <span>Iniziata il {formatProjectDateTime(selectedSession.started_at)}</span>
                {selectedSession.completed_at && (
                  <span>· Completata il {formatProjectDateTime(selectedSession.completed_at)}</span>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                {selectedSession.status === "Completata" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setConfirmReopenOpen(true)}
                  >
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                    Riapri sessione
                  </Button>
                )}
                {sessionTask.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => exportSessionToExcel(selectedSession, sessionTask)}
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      Excel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => exportSessionToPdf(selectedSession, sessionTask)}
                    >
                      <FileText className="h-4 w-4 text-red-500" />
                      PDF
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Elimina sessione
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {loading || !initialFetchDone ? (
            <Loader label="Caricamento sessione..." />
          ) : sessionNotFound ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Questa sessione non esiste più o è stata rimossa.</p>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(backPath)}>
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            </div>
          ) : (
            <StandardTable
              headers={!readOnly ? [...BASE_HEADERS, ACTIONS_HEADER] : BASE_HEADERS}
              data={sessionTask}
              emptyMessage={selectedSession?.tasks_deleted ? "Le task di questa sessione sono state eliminate." : "Nessuna task in questa sessione."}
              emptyIcon={ListChecks}
              renderRow={(task) => (
                <SessionTaskRow
                  key={task.checklist_item_id}
                  task={task}
                  readOnly={readOnly}
                  currentUserId={user?.id}
                  onEdit={setEditingTask}
                  onReopen={setReopenOutcomeTarget}
                />
              )}
            />
          )}
        </div>

        {editingTask && (
          <UpdateOutcomeModal
            key={editingTask.checklist_item_id}
            modalOpen={!!editingTask}
            setModalOpen={(open) => { if (!open) setEditingTask(null); }}
            task={editingTask}
            onSubmit={handleUpdateOutcome}
          />
        )}

        <Dialog open={confirmReopenOpen} onOpenChange={(open) => { if (!open) setConfirmReopenOpen(false); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <RotateCcw className="h-4 w-4 text-orange-600" />
                Riapri sessione
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Riaprire questa sessione azzererà l'esito di tutte le task non bloccate al suo interno: il tester dovrà rivalutarle. Il tester riceverà un'email di notifica.
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfirmReopenOpen(false)}>
                Annulla
              </Button>
              <Button
                onClick={handleReopenSession}
                disabled={reopeningSession}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                {reopeningSession ? "Riapertura..." : "Sì, riapri sessione"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!reopenOutcomeTarget} onOpenChange={(open) => { if (!open) setReopenOutcomeTarget(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <RotateCcw className="h-4 w-4 text-amber-600" />
                Riapri esito
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              L'esito già inviato per "{reopenOutcomeTarget?.description}" tornerà modificabile. Confermi?
            </p>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReopenOutcomeTarget(null)} disabled={reopeningOutcome}>
                Annulla
              </Button>
              <Button
                onClick={handleConfirmReopenOutcome}
                disabled={reopeningOutcome}
                className="bg-amber-500 text-white hover:bg-amber-600"
              >
                {reopeningOutcome ? "Riapertura..." : "Sì, riapri esito"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DeleteConfirmModal
          modalOpen={confirmDeleteOpen}
          setModalOpen={setConfirmDeleteOpen}
          itemPhrase="la sessione"
          itemName={`#${id}`}
          extraInfo={selectedSession?.tasks_deleted ? undefined : "Le task collegate a questa sessione torneranno allo stato TODO."}
          onConfirm={handleDeleteSession}
          loading={deletingSession}
        />
      </div>
    </AppLayout>
  );
};

export default SessionDetail;
