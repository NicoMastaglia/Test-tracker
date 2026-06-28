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

  // ---------------- USERS ----------------
  "user.registered": {
    label: "USER REGISTRATO",
    color: " text-emerald-700",
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
    label: "PROJECT CREATO",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: FolderPlus,
  },
  "project.updated": {
    label: "PROJECT AGGIORNATO",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    icon: FolderPen,
  },
  "project.status_changed": {
    label: "PROJECT STATO MODIFICATO",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    icon: CheckCircle2,
  },
  "project.member_assigned": {
    label: "PROJECT MEMBRO ASSEGNATO",
    color: "border-teal-200 bg-teal-50 text-teal-700",
    icon: UserCheck,
  },
  "project.member_unassigned": {
    label: "PROJECT MEMBRO RIMOSSO",
    color: "border-orange-200 bg-orange-50 text-orange-700",
    icon: UserX,
  },
  "project.deleted": {
    label: "PROJECT ELIMINATO",
    color: " text-red-700",
    bgColor: "bg-red-50",
    icon: Trash2,
  },

  // ---------------- CHECKLIST ----------------
  "checklist.created": {
    label: "CHECKLIST CREATA",
    color: "border-purple-200 bg-purple-50 text-purple-700",
    icon: ClipboardPlus,
  },
  "checklist.updated": {
    label: "CHECKLIST AGGIORNATA",
    color: "border-purple-200 bg-purple-50 text-purple-700",
    icon: ClipboardPen,
  },
  "checklist.deleted": {
    label: "CHECKLIST ELIMINATA",
    color: "border-red-200 bg-red-50 text-red-700",
    icon: ClipboardX,
  },

  // ---------------- TASK ----------------
  "task.created": {
    label: "TASK CREATA",
    color: "border-amber-200 bg-amber-50 text-amber-700",
    icon: SquarePlus,
  },
  "task.updated": {
    label: "TASK AGGIORNATA",
    color: "border-yellow-200 bg-yellow-50 text-yellow-700",
    icon: SquarePen,
  },
  "task.deleted": {
    label: "TASK ELIMINATA",
    color: "border-red-200 bg-red-50 text-red-700",
    icon: SquareX,
  },
  "task.assigned": {
    label: "TASK ASSEGNATA",
    color: "border-teal-200 bg-teal-50 text-teal-700",
    icon: UserCheck,
  },
  "task.status_blocked": {
    label: "TASK BLOCCATA",
    color: "border-orange-200 bg-orange-50 text-orange-700",
    icon: CircleSlash,
  },
  "task.status_archived": {
    label: "TASK ARCHIVIATA",
    color: "border-slate-200 bg-slate-100 text-slate-700",
    icon: Archive,
  },
  "task.unarchived": {
    label: "TASK RIPRISTINATA",
    color: "border-lime-200 bg-lime-50 text-lime-700",
    icon: RotateCcw,
  },
  "task.status_changed": {
    label: "TASK STATO MODIFICATO",
    color: "border-indigo-200 bg-indigo-50 text-indigo-700",
    icon: CheckCircle2,
  },

  // ---------------- SESSIONS ----------------
  "session.created": {
    label: "Session Creata",
    color: "border-rose-200 bg-rose-50 text-rose-700",
    icon: PlayCircle,
  },
  "session.completed": {
    label: "Session Completata",
    color: "border-green-200 bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  "session.reopened": {
    label: "Session Riaperta",
    color: "border-orange-200 bg-orange-50 text-orange-700",
    icon: RotateCcw,
  },
  "session.deleted": {
    label: "Session Eliminata",
    color: "border-red-200 bg-red-50 text-red-700",
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
  checklistId: { label: "Checklist" },
  title: { label: "Titolo" },
  itemId: { label: "Task" },
  templateId: { label: "Checklist" },
  description: { label: "Descrizione" },
  newDescription: { label: "Nuova descrizione" },
  assignedTo: { label: "Assegnata a" },
  sessionId: { label: "Sessione" },
  checklistItemIds: { label: "Task incluse" },
  note: { label: "Nota" },
  outcome: { label: "Esito" },
};

// fallback per chiavi non ancora mappate (un campo nuovo nel BE non rompe la UI)
export const defaultDetailField = { label: null };