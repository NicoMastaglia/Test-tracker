
// helper per parsare la stringa JSON dei dettagli di un audit log
export const parseStrDetails = (str) => {
  return str ? JSON.parse(str) : { };
};


