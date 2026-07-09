

// definizione dei campi per il form di creazione/modifica progetto


export const projectFields = [
	{
		name: "name",
		label: "Nome progetto",
		placeholder: "Inserisci il nome del progetto",
		type: "text",
		autoComplete: "new-project-name",
		required: true,
	},
	{
		name: "description",
		label: "Descrizione",
		type: "textarea",
		rows: 4,
		placeholder: "Inserisci una descrizione del progetto",
		required: true,
	},
	{
		name: "deadline",
		label: "Scadenza",
		type: "date",
		placeholder: "Seleziona la data di scadenza (opzionale)",
	},
	// {
	// 	name : "responsabile",
	// 	label: "Responsabile",
	// 	placeholder: "Seleziona il responsabile del progetto",
	// 	type: "select",
	// 	required: true,
	// 	options: []
	//  } // le opzioni vengono caricate dinamicamente in AdminProjects.jsx dopo aver fetchato gli utenti
];
