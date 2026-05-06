import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-300 w-full p-4 sticky top-0 z-50">
      <div className="w-full flex justify-between items-center px-1 md:px-8">
        
        {/* IZQUIERDA: Logo (Sin escalado, altura fija) */}
        <div className="flex-1 flex justify-start items-center">
          <Link to="/">
            <img 
              src={logo} 
              alt="Logo UfoCatcher" 
              className="h-12 w-auto object-contain mix-blend-multiply" 
            />
          </Link>
        </div>

        {/* CENTRO: Ranking Global (Dualidad: Trofeo en móvil, Texto original en PC) */}
        <div className="flex flex-none justify-center">
          <Link 
            to="/ranking" 
            title="Ranking Global"
            className="flex items-center justify-center rounded-full transition-all duration-300 
              h-9 w-9 bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100 hover:border-gray-200 hover:text-primario 
              md:h-auto md:w-auto md:px-5 md:py-1.5 md:bg-transparent md:text-texto md:border-texto md:hover:border-primario md:font-semibold"
          >
            <span className="text-base leading-none md:hidden">🏆</span>
            <span className="hidden md:block">Ranking Global</span>
          </Link>
        </div>

        {/* DERECHA: Privacidad + Agradecimientos + Auth/Perfil */}
        <div className="flex-1 flex justify-end items-center gap-1.5 md:gap-4">
          
          {/* Privacidad - "Bolita" en móvil */}
          <Link 
            to="/privacidad" 
            title="Política de Privacidad"
            className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-primario bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 h-9 w-9 rounded-full md:h-auto md:w-auto md:px-4 md:py-1.5"
          >
            <span className="text-base leading-none">🛡️</span>
            <span className="hidden md:block">Privacidad</span>
          </Link>

          {/* Agradecimientos - "Bolita" en móvil */}
          <Link 
            to="/agradecimientos" 
            title="Agradecimientos"
            className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-primario bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 h-9 w-9 rounded-full md:h-auto md:w-auto md:px-4 md:py-1.5"
          >
            <span className="text-base leading-none">✨</span>
            <span className="hidden md:block">Agradecimientos</span>
          </Link>

          {/* Divisor vertical sutil */}
          <div className="hidden sm:block h-6 w-px bg-gray-300 mx-1"></div>

          {/* Lógica de Autenticación */}
          {!user ? (
            <div className="flex gap-1.5 md:gap-2 font-semibold text-[11px] md:text-sm">
              <button 
                onClick={() => onOpenAuth('login')}
                className="border border-texto text-texto px-2 md:px-4 py-1.5 md:py-2 rounded hover:border-primario hover:text-primario transition-colors"
              >
                Entrar
              </button>
              
              <button 
                onClick={() => onOpenAuth('register')}
                className="border border-primario bg-primario text-white px-2 md:px-4 py-1.5 md:py-2 rounded hover:bg-secundario hover:border-secundario transition-colors shadow-sm"
              >
                Registro
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-6">
              <Link 
                to="/perfil" 
                className="flex items-center gap-3 group transition-transform hover:scale-105"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none group-hover:text-primario transition-colors">
                    Piloto
                  </p>
                  <p className="text-sm font-bold text-texto leading-tight group-hover:text-primario transition-colors">
                    {user.username}
                  </p>
                </div>
                
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-primario to-secundario flex items-center justify-center shadow-sm border-2 border-white ring-1 ring-gray-100 group-hover:ring-primario transition-all">
                  <span className="text-white font-black text-sm md:text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>

              <button 
                onClick={handleLogout}
                className="hidden sm:block text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-tighter border-b border-transparent hover:border-red-700"
              >
                Salir
              </button>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}