
// definizione dei campi per il form di creazione/modifica utente

export  const userFields = [{
    name: 'name',
    label: 'Nome',
    placeholder: 'Inserisci il nome',
    type: 'text',
    autoComplete: 'new-name',
    required: true
},{
    name: 'surname',
    label: 'Cognome',
    placeholder: 'Inserisci il cognome',
    type: 'text',
    autoComplete: 'new-cognome',
    required: true,
},{
    name: 'email',
    label: 'Email',
    placeholder: 'Inserisci l\'email',
    type: 'email',
    autoComplete: 'new-email',
    required: true
},{
    name: 'role',
    label: 'Ruolo',
    placeholder: 'Seleziona il ruolo',
    type: 'select',
    options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' },
        { value: 'superadmin', label: 'Super Admin' },
    ],
    required: true
},

// {
//     name: 'password',
//     label: 'Password',
//     placeholder: 'Inserisci la password',
//     type: 'password',
//     autoComplete: 'new-password',
//     required: true
// }

]