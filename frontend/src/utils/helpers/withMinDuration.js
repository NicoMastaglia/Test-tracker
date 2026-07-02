// garantisce che una promise resti "in corso" per almeno `ms`, così lo spinner
// di caricamento resta visibile anche quando la richiesta è troppo veloce per notarlo
export const withMinDuration = async (promise, ms = 400) => {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
  return result;
};
