import React from 'react';

export default function Privacidad() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-texto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primario tracking-tight">
          Política de Privacidad 🛡️
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">1. Protección de tu identidad</h2>
        <p className="mb-6 text-gray-600 leading-relaxed">
          UfoCatcher es un proyecto independiente creado con fines de entretenimiento. <strong>No recopilamos correos electrónicos, nombres reales, ubicaciones ni ningún otro dato personal sensible.</strong> Únicamente almacenamos el nombre de usuario (piloto) y una contraseña encriptada de forma segura para poder guardar tu progreso y posición en el ranking global.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">2. Uso de Cookies y Almacenamiento Local</h2>
        <p className="mb-6 text-gray-600 leading-relaxed">
          Para que no tengas que iniciar sesión cada vez que recargas la página, utilizamos el almacenamiento local de tu navegador (Local Storage / Session Storage). Esta es una función técnica estrictamente necesaria para el funcionamiento del juego. <strong>No usamos cookies de rastreo, de terceros, ni de analíticas orientadas al marketing.</strong>
        </p>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">3. Terceros y eliminación de cuenta</h2>
        <p className="text-gray-600 leading-relaxed">
          No compartimos, vendemos ni cedemos tu información a ninguna otra plataforma. Si en algún momento deseas que tu cuenta y tus puntuaciones desaparezcan del registro galáctico, puedes usar la opción de "Borrar Cuenta" desde tu perfil.
        </p>
      </div>
    </div>
  );
}