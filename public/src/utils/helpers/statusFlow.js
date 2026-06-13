// Stati e transizioni di stato condivisi (progetti e checklist).
// I colori dei pallini seguono getProjectStatusBadgeClass (tableHelpers.js).

export const PROJECT_STATUSES = [
	{ value: "Non iniziato", dotClass: "bg-slate-400" },
	{ value: "Attivo", dotClass: "bg-blue-500" },
	{ value: "In pausa", dotClass: "bg-amber-500" },
	{ value: "Completato", dotClass: "bg-emerald-500" },
];

// Stati di riferimento per le checklist (campo non ancora presente nel BE)
export const CHECKLIST_STATUSES = [
	{ value: "Non iniziato", dotClass: "bg-slate-400" },
	{ value: "In corso", dotClass: "bg-blue-500" },
	{ value: "Completata", dotClass: "bg-emerald-500" },
];

// Flusso degli stati progetto:
// Non iniziato -> Attivo; Attivo -> Completato | In pausa; In pausa -> Attivo; Completato = finale
export const getAvailableProjectStatuses = (currentStatus) => {
	switch (currentStatus) {
		case "Non iniziato":
			return ["Attivo"];
		case "Attivo":
			return ["Completato", "In pausa"];
		case "In pausa":
			return ["Attivo"];
		case "Completato":
			return [];
		default:
			// stato sconosciuto (es. progetti vecchi): non blocchiamo nulla
			return PROJECT_STATUSES.map((status) => status.value);
	}
};
