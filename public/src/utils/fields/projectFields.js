

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
		placeholder: "Inserisci una descrizione",
		type: "textarea",
		rows: 4,
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
