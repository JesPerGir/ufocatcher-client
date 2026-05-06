import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import Agradecimientos from './pages/Agradecimientos'; // <-- Importamos la página
import AuthForm from './components/AuthForm';
import Privacidad from './pages/Privacidad';

function App() {
  const [authModal, setAuthModal] = useState(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-fondo text-white font-sans selection:bg-primario selection:text-white relative">
        
        <Navbar onOpenAuth={(type) => setAuthModal(type)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/agradecimientos" element={<Agradecimientos />} />
            <Route path="/perfil" element={<Profile />} />
          </Routes>
        </main>

        {authModal && (
          <AuthForm 
            type={authModal} 
            onClose={() => setAuthModal(null)} 
            onSwitchType={(type) => setAuthModal(type)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;