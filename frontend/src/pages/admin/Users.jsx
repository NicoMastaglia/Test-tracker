import AppLayout from "@/Components/layout/AppLayout";
import ManageUsers from "@/Components/features/users/ManageUsers";
import ActionBar from "@/utils/components/ActionBar";
import React, { useState, useEffect, useMemo } from "react";
import { register } from "@/services/Auth/auth";
import { toast } from "sonner";
import { useUserContext } from "@/context/User/UserContext";
import { filterSearch } from "@/utils/helpers/filterSearch";
import { isEmailValid } from "@/utils/helpers/validators";
import ModalForm from "@/utils/components/ModalForm";
import { userFields } from "@/utils/fields/userFields";
import StatsCardsRow from "@/utils/components/StatsCardsRow";
import Loader from "@/utils/components/Loader";
import { UserPlus, Users as UsersIcon, ShieldCheck, ShieldAlert, User } from "lucide-react"
import { withMinDuration } from "@/utils/helpers/withMinDuration"

const Users = () => {
  const emptyNewUserData = {
    name: "",
    surname: "",
    email: "",
    role: "",
  };

  const [token] = useState(localStorage.getItem("auth_token"));
  const { users, fetchUsers, loading } = useUserContext();
  const [newUserData, setNewUserData] = useState(emptyNewUserData);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);


  // reset formData quando si chiude il modal
  useEffect(() => {
    if (!modal) {
      setNewUserData(emptyNewUserData);
      setFormErrors({});
    }
  }, [modal]);


  const addUser = async () => {
    const { name, surname, email, role } = newUserData;

    const nextErrors = {};
    if (!name) nextErrors.name = "Il nome è obbligatorio";
    if (!surname) nextErrors.surname = "Il cognome è obbligatorio";
    if (!email) nextErrors.email = "L'email è obbligatoria";
    else if (!isEmailValid(email)) nextErrors.email = "Indirizzo email non valido";
    if (!role) nextErrors.role = "Seleziona un ruolo";

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setCreatingUser(true);
    try {
      await withMinDuration(register(name, surname, email, role, token));
      await fetchUsers();
      toast.success("Utente creato con successo!");
      setNewUserData(emptyNewUserData);
      setModal(false);
    } catch (error) {
      console.error("Errore durante la creazione dell'utente:", error.response?.data || error.message);
      const message = error.response?.data?.message || error.message;
      if (message === "User with this email already exists") {
        toast.error("Esiste già un utente con questa email, scegli un'email diversa");
        return;
      }
      toast.error("Errore durante la creazione dell'utente");
    } finally {
      setCreatingUser(false);
    }
  };

  const filterUsers = useMemo(() => {
    return filterSearch(search, users, ["nome", "cognome", "email"]);
  }, [search, users]);

  const userStats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const superadmins = users.filter((u) => u.role === "superadmin").length;
    const standard = total - admins - superadmins;
    return [
      {
        label: "Total Users",
        value: total,
        icon: UsersIcon,
        iconColor: "text-emerald-600",
        bgIcon: "bg-emerald-100",
      },
      {
        label: "Admins",
        value: admins,
        icon: ShieldCheck,
        iconColor: "text-violet-600",
        bgIcon: "bg-violet-100",
      },
      {
        label: "Super Admins",
        value: superadmins,
        icon: ShieldAlert,
        iconColor: "text-pink-700",
        bgIcon: "bg-pink-100",
      },
      {
        label: "Standard Users",
        value: standard,
        icon: User,
        iconColor: "text-green-700",
        bgIcon: "bg-green-100",
      },
    ];
  }, [users]);

  return (
    <AppLayout page="users" title="Utenti">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <StatsCardsRow stats={userStats}  />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca utente..."
            buttonText="Add User"
            onButtonClick={() => setModal(true)}
            buttonVariant="emerald"
          />

          {loading && users.length === 0 ? (
            <Loader label="Caricamento utenti..." />
          ) : (
            <ManageUsers data={filterUsers} />
          )}

          <ModalForm
            modalOpen={modal}
            setModalOpen={setModal}
            onClose={() => setNewUserData(emptyNewUserData)}
            title="Nuovo Utente"
            infos="Compila i campi per creare un nuovo utente."
            fields={userFields}
            formData={newUserData}
            setFormData={setNewUserData}
            errors={formErrors}
            onSubmit={addUser}
            submitLabel="Aggiungi Utente"
            loadingLabel="Creazione..."
            loading={creatingUser}
            cancelLabel="Annulla"
            submitClassName="bg-emerald-500 text-white hover:bg-emerald-600"
            iconColor="text-emerald-600"
            titleIcon={UserPlus}
           />
        </div>
      </div>
    </AppLayout>
  );
};

export default Users;
