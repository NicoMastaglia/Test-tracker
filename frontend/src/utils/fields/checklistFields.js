  
 // definizione dei campi per il form di creazione/modifica checklist
 
 export const checklistFields = [
	{
		name: "title",
		label: "Titolo checklist",
		placeholder: "Inserisci il titolo della checklist",
		type: "text",
		autoComplete: "new-checklist-title",
		required: true,
	},
	{
		name: "description",
		label: "Descrizione",
		placeholder: "Inserisci una descrizione per la checklist",
		type: "textarea",
		autoComplete: "new-checklist-description",
		required: false,
	},

 ]
	
