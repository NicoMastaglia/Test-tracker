export const isEmailValid = (email) => {

  
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

 
  const emailLower = email.toLowerCase();
  const macroProviders = ['@gmail.', '@outlook.', '@yahoo.', '@hotmail.', '@icloud.'];
  const matchesProvider = macroProviders.some(provider => emailLower.includes(provider));
  
  
  if (matchesProvider) {
    const validEnds = ['.com', '.it'];
    if (!validEnds.some(end => emailLower.endsWith(end))) return false;
  }

  return true;
};
