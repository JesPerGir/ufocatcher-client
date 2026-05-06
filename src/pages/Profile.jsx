import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom'; // Añadido useNavigate aquí
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Eliminado el email del estado, ahora solo importa la contraseña
  const [editForm, setEditForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [mensaje, setMensaje] = useState(null);
  const [descargando, setDescargando] = useState(false);
  const tablaRef = useRef(null);

  if (!user) return <Navigate to="/" />;

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/puntuaciones/historial`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistorial(data);
        }
      } catch (error) {
        console.error('Error al cargar historial', error);
      }
    };
    fetchHistorial();
  }, [token, user]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleBorrarCuenta = async () => {
    const confirmar = window.confirm(
      "⚠️ ¿Estás seguro de que quieres borrar tu cuenta?\n\nEsta acción es irreversible: perderás tu nombre de piloto y todas tus puntuaciones del ranking global."
    );

    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al borrar la cuenta');
      }

      logout();
      navigate('/');

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (editForm.newPassword || editForm.confirmNewPassword) {
      if (editForm.newPassword !== editForm.confirmNewPassword) {
        setMensaje({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' });
        return;
      }
      if (!editForm.currentPassword) {
        setMensaje({ tipo: 'error', texto: 'Introduce tu contraseña actual para autorizar el cambio.' });
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:3000/api/usuarios/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ tipo: 'exito', texto: data.mensaje });
        setIsEditing(false);
        setEditForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setMensaje({ tipo: 'error', texto: data.error });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor.' });
    }
  };

  const exportarPDF = async () => {
    setDescargando(true);
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const element = tablaRef.current;
      if (!element) return;

      const width = element.offsetWidth;
      const height = element.offsetHeight;

      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });

      const pdfPhysicalWidth = 280;
      const pdfPhysicalHeight = (height / width) * pdfPhysicalWidth;

      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfPhysicalWidth, pdfPhysicalHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfPhysicalWidth, pdfPhysicalHeight);
      pdf.save(`UfoCatcher_Historial_${user.username}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-black text-primario mb-8 tracking-tight">
        Panel de Control del Piloto
      </h1>

      <div className="flex flex-col md:flex-row gap-8">

        {/* COLUMNA IZQUIERDA: Tarjeta de Perfil */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="h-24 w-full bg-gradient-to-r from-primario to-secundario"></div>

            <div className="px-6 pb-6">
              <div className="relative z-10 -mt-12 mb-4 h-24 w-24 rounded-full bg-white p-1.5 shadow-lg">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-primario to-secundario flex items-center justify-center border-2 border-white ring-1 ring-gray-100">
                  <span className="text-white font-black text-4xl drop-shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{user.username}</h2>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 border-2 border-primario text-primario font-bold rounded-lg hover:bg-primario hover:text-white transition-colors shadow-sm"
                  >
                    Cambiar Contraseña
                  </button>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 animate-slide-up">
                    <div className="pt-2 space-y-3">
                      
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-red-500">Contraseña Actual</label>
                        <input
                          type="password" name="currentPassword" placeholder="Tu contraseña actual"
                          value={editForm.currentPassword} onChange={handleEditChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-red-400 outline-none text-sm"
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nueva</label>
                          <input
                            type="password" name="newPassword" placeholder="Nueva"
                            value={editForm.newPassword} onChange={handleEditChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none text-sm"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirmar</label>
                          <input
                            type="password" name="confirmNewPassword" placeholder="Confirmar"
                            value={editForm.confirmNewPassword} onChange={handleEditChange}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-primario outline-none text-sm"
                            required
                          />
                        </div>
                      </div>

                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition">
                        Cancelar
                      </button>
                      <button type="submit" className="flex-1 py-2 bg-primario text-white font-bold rounded-lg hover:bg-secundario transition shadow-sm">
                        Guardar
                      </button>
                    </div>
                  </form>
                )}

                {mensaje && (
                  <div className={`mt-4 p-3 rounded-lg text-sm text-center font-semibold animate-fade-in
                    ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                    {mensaje.texto}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ZONA DE PELIGRO: Botón de borrar cuenta */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
            <h3 className="text-xl font-bold text-red-500 mb-2">Zona de Peligro</h3>
            <p className="text-sm text-gray-500 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Perderás tus puntuaciones y tu nombre de piloto.
            </p>
            <button 
              onClick={handleBorrarCuenta}
              className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 font-bold shadow-sm"
            >
              Borrar mi cuenta definitivamente
            </button>
          </div>

        </div>

        {/* COLUMNA DERECHA: Historial de Partidas */}
        <div className="w-full md:w-2/3">
          <div ref={tablaRef} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Últimas 10 Misiones</h3>
              <span className="bg-secundario/20 text-secundario text-xs font-bold px-3 py-1 rounded-full border border-secundario/30">
                Piloto: {user.username}
              </span>
            </div>

            {historial.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p>Aún no tienes registros de vuelo.</p>
                <p className="text-sm mt-1">¡Sube a la nave y juega tu primera partida!</p>
              </div>
            ) : (
              <div className={descargando ? "overflow-hidden" : "overflow-x-auto"}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="pb-3 pl-2 font-semibold">Fecha de vuelo</th>
                      <th className="pb-3 text-right pr-2 font-semibold">Puntuación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((partida, index) => (
                      <tr key={partida._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 pl-2 text-gray-600 font-medium">
                          {new Date(partida.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4 text-right pr-2">
                          <span className={`font-black ${index === 0 ? 'text-secundario text-lg' : 'text-primario'}`}>
                            {partida.puntos.toLocaleString()} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={exportarPDF}
              disabled={descargando || historial.length === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-sm
                ${descargando || historial.length === 0
                  ? 'border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border border-primario text-primario hover:bg-primario hover:text-white hover:shadow-md hover:-translate-y-0.5'
                }`}
            >
              {descargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar Historial PDF
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}