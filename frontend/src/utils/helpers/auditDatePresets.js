// preset condivisi tra la pagina audit globale e il tab Attività di un progetto:
// stessa lista, stesso comportamento, così la query iniziale resta piccola
// (default "Oggi") e l'utente allrga la finestra solo se serve
export const AUDIT_DATE_PRESETS = [
  { label: "Oggi",        days: 0    },
  { label: "Ieri + oggi", days: 1    },
  { label: "7 giorni",   days: 6    },
  { label: "30 giorni",  days: 29   },
  { label: "Tutto",      days: null  },
];

export const dateFromDaysAgo = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};
