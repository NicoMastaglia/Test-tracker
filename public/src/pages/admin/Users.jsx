import AppLayout from "@/Components/layout/AppLayout";
import ManageUsers from "@/Components/features/users/ManageUsers";
import ActionBar from "@/utils/ActionBar";
import React, { useState, useEffect, useMemo } from "react";
import { register } from "@/services/api";
import { toast } from "sonner";
import { useUserContext } from "@/context/User/UserContext";
import { filterSearch } from "@/utils/filterSearch";
import { isEmailValid } from "@/utils/validators";
import ModalForm from "@/utils/ModalForm";
import { userFields } from "@/utils/fields/userFields";
import KpiCard from "@/utils/KpiCard";
import { UserPlus, Users as UsersIcon, ShieldCheck, ShieldAlert, User } from "lucide-react"

const Users = () => {
  const emptyNewUserData = {
    name: "",
    surname: "",
    email: "",
    role: "",
    password: "",
  };

  const [token] = useState(localStorage.getItem("auth_token"));
  const { users, fetchUsers } = useUserContext();
  const [newUserData, setNewUserData] = useState(emptyNewUserData);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);
  

  // reset formData quando si chiude il modal
  useEffect(() => {
    if (!modal) {
      setNewUserData(emptyNewUserData);
    }
  }, [modal]);
  

  const addUser = async () => {
    const { name, surname, email, role, password } = newUserData;

    if (!isEmailValid(email)) {
      toast.error("Indirizzo email non valido");
      return;
    }

    try {
      await register(name, surname, email, password, role, token);
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
    return { total, admins, superadmins, standard };
  }, [users]);

  return (
    <AppLayout page="users">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Users"
            value={userStats.total.toString()}
            icon={UsersIcon}
            iconClass="bg-emerald-100 text-emerald-600"
          />
          <KpiCard
            title="Admins"
            value={userStats.admins.toString()}
            icon={ShieldCheck}
            iconClass="bg-violet-100 text-violet-600"
          />
          <KpiCard
            title="Super Admins"
            value={userStats.superadmins.toString()}
            icon={ShieldAlert}
            iconClass="bg-pink-100 text-pink-700"
          />
          <KpiCard
            title="Standard Users"
            value={userStats.standard.toString()}
            icon={User}
            iconClass="bg-green-100 text-green-700"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActionBar
            search={search}
            setSearch={setSearch}
            placeholder="Cerca utente..."
            buttonText="Add User"
            onButtonClick={() => setModal(true)}
            buttonVariant="emerald"
          />

          <ManageUsers data={filterUsers} />

          <ModalForm
            modalOpen={modal}
            setModalOpen={setModal}
            onClose={() => setNewUserData(emptyNewUserData)}
            title="Nuovo Utente"
            infos="Compila i campi per creare un nuovo utente."
            fields={userFields}
            formData={newUserData}
            setFormData={setNewUserData}
            onSubmit={addUser}
            submitLabel="Aggiungi Utente"
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
