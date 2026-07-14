// Domini ammessi: solo gmail.com e example.com (o example senza TLD) per questo contesto

// IMPORTANTE se si aggiungono domini, aggiornare anche il BE (backend/utils/validators.js)
//  per la validazione lato server,
//  altrimenti l'utente potrebbe aggirare
//  il controllo frontend e registrarsi con un dominio non ammesso.

const ALLOWED_DOMAINS = ["gmail.com", "example.com", "example"];

export const isEmailValid = (email) => {
 
  const match = email.match(/^[a-zA-Z0-9._%+-]+@(.+)$/);   //  // ['email', 'dominio', index' ,...]
  if (!match) return false;
  // match[1] contiene il dominio 
  return ALLOWED_DOMAINS.includes(match[1].toLowerCase());
};
