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
  ShieldPlus,
} from "lucide-react";

export const auditActions = {
  // ---------------- AUTH ----------------
  "auth.login": {
    label: "LOGIN EFFETTUATO",
    color: " text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    icon: LogIn,
  },
  "auth.logout": {
    label: "LOGOUT EFFETTUATO",
    color: " text-slate-700 dark:text-slate-300",

    icon: LogOut,
  },
  "auth.password_reset_requested": {
    label: "RESET PASSWORD RICHIESTO",
    color: " text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    icon: KeyRound,
  },
  "auth.bootstrap": {
    label: "SUPERADMIN BOOTSTRAP",
    color: "text-violet-700 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-500/10",
    icon: ShieldPlus,
  },

  // ---------------- USERS ----------------
  "user.registered": {
    label: "USER REGISTRATO",
    color: " text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: UserPlus,
  },
  "user.updated": {
    label: "USER AGGIORNATO",
    color: "text-sky-700 dark:text-sky-400",
    icon: UserPen,
  },
  "user.deleted": {
    label: "USER ELIMINATO",
    color: "text-red-700 dark:text-red-400",
    icon: UserMinus,
  },

  // ---------------- PROJECTS ----------------
  "project.created": {
    label: "PROGETTO CREATO",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: FolderPlus,
  },
  "project.updated": {
    label: "PROGETTO AGGIORNATO",
    color: "text-sky-700 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-500/10",
    icon: FolderPen,
  },
  "project.status_changed": {
    label: "STATO PROGETTO MODIFICATO",
    color: "text-indigo-700 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
    icon: CheckCircle2,
  },
  "project.member_assigned": {
    label: "PROGETTO: TESTER ASSEGNATO",
    color: "text-teal-700 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-500/10",
    icon: UserCheck,
  },
  "project.member_unassigned": {
    label: "PROGETTO: TESTER RIMOSSO",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    icon: UserX,
  },
  "project.deleted": {
    label: "PROGETTO ELIMINATO",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    icon: Trash2,
  },

  // ---------------- CHECKLIST ----------------
  "checklist.created": {
    label: "CHECKLIST CREATA",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    icon: ClipboardPlus,
  },
  "checklist.updated": {
    label: "CHECKLIST AGGIORNATA",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    icon: ClipboardPen,
  },
  "checklist.deleted": {
    label: "CHECKLIST ELIMINATA",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    icon: ClipboardX,
  },

  // ---------------- TASK ----------------
  "task.created": {
    label: "TASK CREATA",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    icon: SquarePlus,
  },
  "task.updated": {
    label: "TASK AGGIORNATA",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-500/10",
    icon: SquarePen,
  },
  "task.deleted": {
    label: "TASK ELIMINATA",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    icon: SquareX,
  },
  "task.assigned": {
    label: "TASK : TESTER ASSEGNATO",
    color: "text-teal-700 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-500/10",
    icon: UserCheck,
  },
  "task.status_blocked": {
    label: "TASK BLOCCATA",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    icon: CircleSlash,
  },
  "task.status_archived": {
    label: "TASK ARCHIVIATA",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-500/15",
    icon: Archive,
  },
  "task.unarchived": {
    label: "TASK RIPRISTINATA",
    color: "text-lime-700 dark:text-lime-400",
    bgColor: "bg-lime-50 dark:bg-lime-500/10",
    icon: RotateCcw,
  },
  "task.status_unblocked": {
    label: "TASK SBLOCCATA",
    color: "text-teal-700 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-500/10",
    icon: RotateCcw,
  },
  "task.status_changed": {
    label: "STATO TASK MODIFICATO",
    color: "text-indigo-700 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-500/10",
    icon: CheckCircle2,
  },
  "task.outcome_reopened": {
    label: "ESITO TASK RIAPERTO",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    icon: RotateCcw,
  },

  // ---------------- SESSIONS ----------------
  "session.created": {
    label: "SESSIONE CREATA",
    color: "text-rose-700 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-500/10",
    icon: PlayCircle,
  },
  "session.completed": {
    label: "SESSIONE COMPLETATA",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-500/10",
    icon: CheckCircle2,
  },
  "session.reopened": {
    label: "SESSIONE RIAPERTA",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    icon: RotateCcw,
  },
  "session.deleted": {
    label: "SESSIONE ELIMINATA",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
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