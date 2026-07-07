import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/Auth/AuthContext";


export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuthContext();

  // 1. Se l'utente non è loggato, vai al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se l'utente è loggato ma non ha il ruolo giusto, vai a una pagina di errore o dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; 
    // Oppure a una pagina "/unauthorized"
  }

  // 3. Se è tutto ok, renderizza il componente figlio
  return children;
}
export default ProtectedRoute;