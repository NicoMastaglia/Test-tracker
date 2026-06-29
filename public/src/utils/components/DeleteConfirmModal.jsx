import { Trash2 } from "lucide-react";
import ModalForm from "@/utils/components/ModalForm";

// Modale di conferma eliminazione standardizzata, riusabile per qualsiasi entità
// (progetto, checklist, task, utente...). Mantiene fisso lo stile (icona rossa,
// box bg-red-50/50, pulsanti Annulla/Sì Elimina) e lascia variabile solo il testo.
const DeleteConfirmModal = ({
  modalOpen,
  setModalOpen,
  itemPhrase, // es. "la checklist", "il task", "il progetto", "l'utente"
  itemName,
  extraInfo = null, // nodo opzionale sotto il nome (es. descrizione, id progetto)
  warningText = "Questa azione è irreversibile.",
  onConfirm,
  confirmLabel = "Sì, Elimina",
  title = "Conferma eliminazione",
}) => (
  <ModalForm
    modalOpen={modalOpen}
    setModalOpen={setModalOpen}
    title={title}
    infos={warningText}
    hasDescripion
    description={(
      <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-sm text-red-800">
        <p>
          Sei sicuro di voler eliminare {itemPhrase}{" "}
          <strong className="font-semibold">"{itemName}"</strong>?
        </p>
        {extraInfo && <div className="mt-2 text-xs text-red-700/80">{extraInfo}</div>}
      </div>
    )}
    formData={{}}
    setFormData={() => {}}
    onSubmit={onConfirm}
    submitLabel={confirmLabel}
    cancelLabel="Annulla"
    dialogClassName="sm:max-w-105"
    titleIcon={Trash2}
    iconColor="text-red-500"
    submitVariant="destructive"
    submitClassName="bg-red-600 hover:bg-red-700 text-white"
  />
);

export default DeleteConfirmModal;
