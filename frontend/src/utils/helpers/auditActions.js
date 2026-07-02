import {
  LogIn,
  LogOut,
  UserPlus,
  UserPen,
  UserMinus,
  FolderPlus,
  FolderPen,
  FolderX,
  UserCheck,
  UserX,
  ClipboardPlus,
  ClipboardPen,
  ClipboardX,
  SquarePlus,
  SquarePen,
  SquareX,
  CircleSlash,
  Archive,
  RotateCcw,
  CheckCircle2,
  PlayCircle,
  Trash2,
  KeyRound,
} from "lucide-react";

export const auditActions = {
  // ---------------- AUTH ----------------
  "auth.login": {
    label: "LOGIN EFFETTUATO",
    color: " text-blue-700",
    bgColor: "bg-blue-50",
    icon: LogIn,
  },
  "auth.logout": {
    label: "LOGOUT EFFETTUATO",
    color: " text-slate-700",

    icon: LogOut,
  },
  "auth.password_reset_requested": {
    label: "RESET PASSWORD RICHIESTO",
    color: " text-amber-700",
    bgColor: "bg-amber-50",
    icon: KeyRound,
  },

  // ---------------- USERS ----------------
  "user.registered": {
    label: "USER REGISTRATO",
    color: " text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: UserPlus,
  },
  "user.updated": {
    label: "USER AGGIORNATO",
    color: "text-sky-700",
    icon: UserPen,
  },
  "user.deleted": {
    label: "USER ELIMINATO",
    color: "text-red-700",
    icon: UserMinus,
  },

  // ---------------- PROJECTS ----------------
  "project.created": {
    label: "PROGETTO CREATO",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: FolderPlus,
  },
  "project.updated": {
    label: "PROGETTO AGGIORNATO",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    icon: FolderPen,
  },
  "project.status_changed": {
    label: "STATO PROGETTO MODIFICATO",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    icon: CheckCircle2,
  },
  "project.member_assigned": {
    label: "PROGETTO: TESTER ASSEGNATO",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    icon: UserCheck,
  },
  "project.member_unassigned": {
    label: "PROGETTO: TESTER RIMOSSO",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    icon: UserX,
  },
  "project.deleted": {
    label: "PROGETTO ELIMINATO",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: Trash2,
  },

  // ---------------- CHECKLIST ----------------
  "checklist.created": {
    label: "CHECKLIST CREATA",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    icon: ClipboardPlus,
  },
  "checklist.updated": {
    label: "CHECKLIST AGGIORNATA",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    icon: ClipboardPen,
  },
  "checklist.deleted": {
    label: "CHECKLIST ELIMINATA",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: ClipboardX,
  },

  // ---------------- TASK ----------------
  "task.created": {
    label: "TASK CREATA",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: SquarePlus,
  },
  "task.updated": {
    label: "TASK AGGIORNATA",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    icon: SquarePen,
  },
  "task.deleted": {
    label: "TASK ELIMINATA",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: SquareX,
  },
  "task.assigned": {
    label: "TASK : TESTER ASSEGNATO",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    icon: UserCheck,
  },
  "task.status_blocked": {
    label: "TASK BLOCCATA",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    icon: CircleSlash,
  },
  "task.status_archived": {
    label: "TASK ARCHIVIATA",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    icon: Archive,
  },
  "task.unarchived": {
    label: "TASK RIPRISTINATA",
    color: "text-lime-700",
    bgColor: "bg-lime-50",
    icon: RotateCcw,
  },
  "task.status_unblocked": {
    label: "TASK SBLOCCATA",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    icon: RotateCcw,
  },
  "task.status_changed": {
    label: "STATO TASK MODIFICATO",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    icon: CheckCircle2,
  },
  "task.outcome_reopened": {
    label: "ESITO TASK RIAPERTO",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: RotateCcw,
  },

  // ---------------- SESSIONS ----------------
  "session.created": {
    label: "SESSIONE CREATA",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    icon: PlayCircle,
  },
  "session.completed": {
    label: "SESSIONE COMPLETATA",
    color: "text-green-700",
    bgColor: "bg-green-50",
    icon: CheckCircle2,
  },
  "session.reopened": {
    label: "SESSIONE RIAPERTA",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    icon: RotateCcw,
  },
  "session.deleted": {
    label: "SESSIONE ELIMINATA",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: SquareX,
  },
};

// Mappa per nome-chiave dentro "details" (dopo il parse). Una sola volta, indipendente
// dall'azione: le stesse chiavi (es. itemId, sessionId) ricompaiono in più eventi diversi.
// Solo etichette leggibili, niente icone: l'obiettivo è la chiarezza del testo.
export const detailFieldMap = {
  email: { label: "Email" },
  role: { label: "Ruolo" },
  name: { label: "Nome" },
  deletedProject: { label: "Progetto eliminato" },
  from: { label: "Da" },
  to: { label: "A" },
  userId: { label: "Utente" },
  title: { label: "Titolo" },
  itemId: { label: "Task" },
  description: { label: "Descrizione" },
  newDescription: { label: "Nuova descrizione" },
  assignedTo: { label: "Assegnata a" },
  sessionId: { label: "Sessione" },
  checklistItemIds: { label: "Task incluse" },
  note: { label: "Nota" },
  outcome: { label: "Esito" },
  reason: { label: "Motivo" },
};

// fallback per chiavi non ancora mappate (un campo nuovo nel BE non rompe la UI)
export const defaultDetailField = { label: null };