export const currentUser = {
  id: 1,
  role: "user"
};

export const users = [{
  id: 1,
  name: "Francesco Rossi",
  email: "francesco.rossi@example.com",
  role: "user",
  password: "password123"
}, {
  id: 3,
  name: "Maria Bianchi",
  email: "maria.bianchi@example.com",
  role: "superadmin",
  password: "password456"
},
{
  id: 2,
  name: "Luca Verdi",
  email: "luca.verdi@example.com",
  role: "user",
  password: "password789"
},
{
  id: 4,
  name: "Giulia Neri",
  email: "giulia.neri@ex.com",
  role: "admin",
  password: "password321"
}
];

export const projects = [
  {
    id: 1,
    name: "Test Tracker Platform",
    description: "Applicazione web per gestione e tracciamento dei casi di test su funzionalita core.",
    status: "Attivo",
    created_by: 101
  },
  {
    id: 2,
    name: "Customer Portal QA",
    description: "Portale clienti per validare flussi di accesso, profilo e notifiche.",
    status: "In pausa",
    created_by: 101
  },
  {
    id: 3,
    name: "Backoffice Gestione Ordini",
    description: "Sistema interno per monitoraggio ordini, export e aggiornamenti stato.",
    status: "Completato",
    created_by: 102
  },
  {
    id: 4,
    name: "Mobile Banking Suite",
    description: "App mobile per autenticazione, consultazione conti e operazioni principali.",
    status: "Attivo",
    created_by: 102
  }
];

export const fakeTasks= [
    {
    id: 1,
    checklist_id: 1,
    description: "Verificare login",
    position: 1,
  },
  {
    id: 2,
    checklist_id: 1,
    description: "Verificare logout",
    position: 2,
  },
]
export const sessions = [
  {
    id: 1,
    project_id: 1,
    user_id: 1,
    status: "completed"
  },
  {
    id: 2,
    project_id: 1,
    user_id: 1,
    status: "in_progress"
  },
  {
    id: 3,
    project_id: 2,
    user_id: 1,
    status: "not_started"
  },
  {
    id: 4,
    project_id: 2,
    user_id: 2,
    status: "in_progress"
  },
  {
    id: 5,
    project_id: 3,
    user_id: 2,
    status: "in_progress"
  },
  {
    id: 6,
    project_id: 3, user_id: 1,
    status: "in_progress"
  },
  {
    id: 7,
    project_id: 4,

    user_id: 1,
    status: "in_progress"
  },
]


export const testResults = [
  {
    id: 1,
    session_id: 1,
    description: "Login funziona",
    is_tested: true,
    outcome: "pass",
    note: "Accesso corretto con credenziali valide"
  },
  {
    id: 2,
    session_id: 1,
    description: "Registrazione funziona",
    is_tested: true,
    outcome: "fail",
    note: "Errore 500 sul submit del form"
  }
  ,{
    id: 3,
    session_id: 1,
    description: "Reset password invia email",
    is_tested: false,
    outcome: null,
    note: ""
  }
  ,{
    id: 4,
    session_id: 2,
    description: "Ricerca utenti",
    is_tested: true,
    outcome: "pass",
    note: "Filtro e ordinamento funzionano"
  },
  {
    id: 5,
    session_id: 2,
    description: "Esportazione CSV",
    is_tested: false,
    outcome: null,
    note: ""
  },
  {
    id: 6,
    session_id: 3,
    description: "Apertura dashboard",
    is_tested: true,
    outcome: "pass",
    note: "Caricamento sotto i 2 secondi"
  },
  {
    id: 7,
    session_id: 3,
    description: "Aggiornamento profilo",
    is_tested: true,
    outcome: "pass",
    note: "Salvataggio dati ok"
  },
  {
    id: 8,
    session_id: 3,
    description: "Notifiche push",
    is_tested: true,
    outcome: "fail",
    note: "Permessi browser non gestiti"
  },
  {
    id: 9,
    session_id: 4,
    description: "Login admin",
    is_tested: false,
    outcome: null,
    note: ""
  }

]


