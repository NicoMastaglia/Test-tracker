import {useNavigate} from 'react-router-dom'


const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen">

            <h1 className="text-6xl font-bold text-slate-800">404</h1>
            <p className="text-lg text-slate-500 mt-4">La pagina che stai cercando non è stata trovata.</p>
            <p className='text-lg text-slate-500 mt-2'> Oppure non disponi dei permessi necessari </p>
            <button 
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-300
                 cursor-pointer"
            >
                Torna alla home
            </button>

        </div>
    );
}

export default NotFound;