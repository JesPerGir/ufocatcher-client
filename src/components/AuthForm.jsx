import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 

export default function AuthForm({ type, onClose, onSwitchType }) {
  const isLogin = type === 'login';
  const { login } = useAuth(); 
  const [errorMsj, setErrorMsj] = useState(''); 
  
  // 1. Estado para controlar si estamos esperando a Render
  const [cargando, setCargando] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '', 
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMsj('');
    setCargando(true); // Empezamos a cargar

    if (!isLogin && formData.password !== formData.confirmPassword) {
        setCargando(false);
        return setErrorMsj('Las contraseñas no coinciden');
    }

    try {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la autenticación');
        }

        login(data.usuario, data.token);
        onClose();

    } catch (error) {
        // AQUÍ ESTÁ LA MAGIA AMIGABLE SI VERCEL CORTA LA CONEXIÓN
        setErrorMsj('⏳ El servidor estaba frío y no llegó a tiempo. ¡Vuelve a darle al botón, que ya está despierto!');
        console.error("Error en la petición:", error);
    } finally {
        setCargando(false); // Terminamos de cargar pase lo que pase
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div onMouseDown={handleBackdropClick} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm p-8 bg-white rounded-lg shadow-2xl border-t-4 border-primario text-texto animate-slide-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-secundario transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-primario">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isLogin ? 'Prepárate para la abducción' : 'Únete al ranking intergaláctico'}
          </p>
        </div>

        {errorMsj && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center shadow-sm">
                {errorMsj}
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Nombre de jugador</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Ej: PilotoX" 
              value={formData.username} 
              onChange={handleChange} 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" 
              required 
              disabled={cargando}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" 
              required 
              disabled={cargando}
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none" 
                required 
                disabled={cargando}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={cargando}
            className={`w-full py-2 mt-2 bg-primario text-white rounded font-bold transition-colors shadow-sm flex justify-center items-center gap-2
              ${cargando ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secundario'}`}
          >
            {cargando ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Conectando...
              </>
            ) : (
              isLogin ? 'Entrar' : 'Registrarse'
            )}
          </button>
          
          {/* Mensaje de espera para el Cold Start de Render */}
          {cargando && (
            <div className="mt-1 text-center animate-pulse">
              <p className="text-[13px] font-semibold text-secundario">
                🚀 Conectando con la nave nodriza...
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">
                (Si el servidor estaba en reposo, puede tardar unos 40 segundos en arrancar)
              </p>
            </div>
          )}

        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              onClick={() => onSwitchType(isLogin ? 'register' : 'login')} 
              type="button" 
              disabled={cargando}
              className="ml-1 text-primario hover:text-secundario font-bold transition-colors disabled:opacity-50"
            >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
        </p>
      </div>
    </div>
  );
}