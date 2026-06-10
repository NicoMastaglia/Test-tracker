
// definizione dei campi per il form di creazione/modifica utente

import { User, Mail, ShieldCheck } from "lucide-react";

export const userFields = [
    {
        name: 'name',
        label: 'Nome',
        placeholder: 'Inserisci il nome',
        type: 'text',
        autoComplete: 'new-name',
        required: true,
        icon: User, // <--- PASSI IL COMPONENTE ICONA
        inputClassName: "pl-10 focus-visible:ring-emerald-500" // <--- CLASSI CUSTOM
    },
    {
        name: 'surname',
        label: 'Cognome',
        placeholder: 'Inserisci il cognome',
        type: 'text',
        autoComplete: 'new-cognome',
        required: true,
        icon: User,
        inputClassName: "pl-10 focus-visible:ring-emerald-500"
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'Inserisci l\'email',
        type: 'email',
        autoComplete: 'new-email',
        required: true,
        icon: Mail,
        inputClassName: "pl-10 focus-visible:ring-emerald-500"
    },
    {
        name: 'role',
        label: 'Ruolo',
        placeholder: 'Seleziona il ruolo',
        type: 'select',
        options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
            { value: 'superadmin', label: 'Super Admin' },
        ],
        required: true,
        icon: ShieldCheck, // <--- Icona per la select
        triggerClassName: "focus:ring-emerald-500"
    },
]
