import React, { useState } from "react";


import { Button } from "@/Components/ui/button";

import { User, Mail, ShieldCheck, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useUserContext } from "@/context/User/UserContext";
import { isEmailValid } from "@/utils/helpers/validators";
import ModalForm from "@/utils/components/ModalForm";
import DeleteConfirmModal from "@/utils/components/DeleteConfirmModal";
import { userFields } from "@/utils/fields/userFields";
import { getFullName, getRoleInfo } from "@/utils/helpers/tableHelpers";
import { withMinDuration } from "@/utils/helpers/withMinDuration";

const ModalForUsers = () => {
  const { selectedUser, clearSelectedUser, updateUser, deleteUser, changeUserRole } = useUserContext();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [roleChangeConfirmOpen, setRoleChangeConfirmOpen] = useState(false);
  const [changingRole, setChangingRole] = useState(false);
  const [formData, setFormData] = useState({
    name: selectedUser?.nome ?? "",
    surname: selectedUser?.cognome ?? "",
    email: selectedUser?.email ?? "",
    role: selectedUser?.role ?? "",
  });

  const isCurrentSuperadmin = selectedUser?.role === "superadmin";

  if (!selectedUser) {
    return null;
  }

  const hasProfileChanges =
    formData.name.trim() !== (selectedUser.nome ?? "").trim() ||
    formData.surname.trim() !== (selectedUser.cognome ?? "").trim() ||
    formData.email.trim() !== (selectedUser.email ?? "").trim();

  const hasRoleChanges = formData.role !== (selectedUser.role ?? ""); 

  const handleCloseModal = () => {
    setDeleteConfirmOpen(false);
    clearSelectedUser();
  };

  const handleSaveProfile = async () => {
    if (!hasProfileChanges) {
      toast.info("Nessuna modifica al profilo da salvare");
      return;
    }

    if (!isEmailValid(formData.email)) {
      toast.error("Indirizzo email non valido");
      return;
    }

    try {
      await updateUser(selectedUser.id, {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim(),
      });
      toast.success("Profilo utente aggiornato con successo");
      handleCloseModal();
    } catch (error) {
      
      const message = error.response?.data?.specific || error.response?.data?.message || "Errore durante il salvataggio del profilo";
      console.error("Errore durante il salvataggio utente:", error.response?.data || error.message);
      toast.error(message);
    }
  };

  const handleRoleChange = () => {
    if (!hasRoleChanges) {
      toast.info("Il ruolo è già aggiornato");
      return;
    }
    setRoleChangeConfirmOpen(true);
  };

  const confirmRoleChange = async () => {
    setChangingRole(true);
    try {
      await changeUserRole(selectedUser.id, formData.role);
      toast.success("Ruolo utente aggiornato con successo");
      setRoleChangeConfirmOpen(false);
      handleCloseModal();
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del ruolo");
      console.error("Errore durante l'aggiornamento del ruolo:", error.response?.data || error.message);
    } finally {
      setChangingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    setDeletingUser(true);
    try {
      await withMinDuration(deleteUser(selectedUser.id));
      toast.success("Utente eliminato con successo");
      setDeleteConfirmOpen(false);
      handleCloseModal();
    } catch (error) {
      toast.error("Errore durante l'eliminazione dell'utente");
      console.error("Errore durante l'eliminazione utente:", error.response?.data || error.message);
    } finally {
      setDeletingUser(false);
    }
  };

   const userModalFooter = (
    <div className={isCurrentSuperadmin ? "flex justify-end gap-3" : "flex justify-between items-center"}>
        {/* Bottone a sinistra */}
        {!isCurrentSuperadmin  ? (
        <Button
            type="button"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-400 dark:hover:bg-red-500/10"
            onClick={() => setDeleteConfirmOpen(true)}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina Utente
        </Button>
        )

      : (
        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 select-none bg-muted/50 px-2.5 py-1.5 rounded-md border border-border">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                Account di sistema protetto
            </div>
      )
      
      }

        {/* Gruppo di bottoni a destra */}
        <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annulla
            </Button>
            <Button
                type="button"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleSaveProfile}
                disabled={!hasProfileChanges}
            >
                Salva Profilo
            </Button>
            {!isCurrentSuperadmin && (
            <Button
                type="button"
                variant="secondary"
                onClick={handleRoleChange}
                disabled={!hasRoleChanges}
            >
                Aggiorna Ruolo
            </Button>
            )}
        </div>
    </div>
);

  return (
    <>



  <ModalForm 
    modalOpen={true}
    setModalOpen={handleCloseModal}
    title="Modifica Utente"
    infos="Aggiorna il profilo o il ruolo. Le due azioni sono separate."
    fields={userFields}
    formData={formData}
    setFormData={setFormData}
    onSubmit={handleSaveProfile}
    submitLabel="Salva Modifiche"
    cancelLabel="Annulla"
    submitClassName="bg-emerald-500 text-white hover:bg-emerald-600"
    customFooter={userModalFooter}
    titleIcon={User}
    dialogClassName = "sm:max-w-124.25"
    iconColor="text-emerald-600"
  />


  

      <ModalForm
        modalOpen={roleChangeConfirmOpen}
        setModalOpen={(open) => { if (!open && !changingRole) setRoleChangeConfirmOpen(false); }}
        title="Cambia ruolo utente"
        infos="Il nuovo ruolo cambia subito i permessi dell'utente nell'app."
        hasDescripion={true}
        description={(
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-center dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-amber-800 dark:text-amber-400">
              Cambiare il ruolo di <span className="font-semibold text-amber-950 dark:text-amber-300">{getFullName(selectedUser)}</span> da{" "}
              <span className="font-semibold text-amber-950 dark:text-amber-300">{getRoleInfo(selectedUser.role).label}</span> a{" "}
              <span className="font-semibold text-amber-950 dark:text-amber-300">{getRoleInfo(formData.role).label}</span>?
            </p>
          </div>
        )}
        onSubmit={confirmRoleChange}
        submitLabel="Aggiorna Ruolo"
        cancelLabel="Annulla"
        dialogClassName="sm:max-w-105"
        titleIcon={ShieldCheck}
        iconColor="text-amber-500"
        submitVariant="destructive"
        loading={changingRole}
      />

      <DeleteConfirmModal
      modalOpen={deleteConfirmOpen}
      setModalOpen={setDeleteConfirmOpen}
      itemPhrase="l'utente"
      itemName={getFullName(selectedUser)}
      onConfirm={handleDeleteUser}
      confirmLabel="Sì, Elimina utente"
      loading={deletingUser}
      />

  
    </>
  );
};

export default ModalForUsers;
