import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="mt-4 text-lg text-slate-500">La pagina che stai cercando non è stata trovata.</p>
      <p className="mt-2 text-lg text-slate-500">Oppure non disponi dei permessi necessari</p>
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-4 cursor-pointer rounded bg-green-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-600"
      >
        Torna alla home
      </button>
    </div>
  );
};

export default NotFound;
