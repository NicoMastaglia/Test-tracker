// definizione dei campi per il form di modifica del progetto (nome + descrizione)
// lo stato si cambia dal bottone dedicato "Cambia stato" nell'header

export const projectEditFields = [
	{
		name: "name",
		label: "Nome progetto",
		type: "text",
		required: true,
		placeholder: "Inserisci il nome del progetto",
		autoComplete: "off",
	},
	{
		name: "description",
		label: "Descrizione",
		type: "textarea",
		rows: 4,
		placeholder: "Inserisci una descrizione del progetto",
	},
	{
		name: "deadline",
		label: "Scadenza",
		type: "date",
		placeholder: "Seleziona la data di scadenza (opzionale)",
	},
];
