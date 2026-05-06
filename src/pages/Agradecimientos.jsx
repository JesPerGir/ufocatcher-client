// client/src/pages/Agradecimientos.jsx
import React from 'react';

export default function Agradecimientos() {
  const recursos = [
    {
      id: 1,
      tipo: "Sprites",
      nombre: "Celestial Objects Pixel Art",
      autor: "norma2d",
      icono: "🪐",
      links: [
        { plataforma: "X.com", url: "https://twitter.com/norma_2d" },
        { plataforma: "DeviantArt", url: "https://www.deviantart.com/norma2d" },
        { plataforma: "Itch.io", url: "https://uselesspursuit.itch.io/celestial-objects-pixel-art-pack?download" }
      ]
    },
    {
      id: 2,
      tipo: "Sprites",
      nombre: "Daily Doodles Pixel Art Asset Pack #1",
      autor: "Zsoka75",
      icono: "🛸",
      links: [
        { plataforma: "X.com", url: "#" }, 
        { plataforma: "Itch.io", url: "https://raventale.itch.io/daily-doodles-pixelart-asset-pack" }
      ]
    },
    {
      id: 3,
      tipo: "Background",
      nombre: "Seamless Space Backgrounds",
      autor: "Screaming Brain Studios",
      icono: "🌌",
      links: [
        { plataforma: "Itch.io", url: "https://screamingbrainstudios.itch.io/seamless-space-backgrounds" }
      ]
    },
    {
      id: 4,
      tipo: "Game Music",
      nombre: "Free Bullet Hell Mini Music Pack",
      autor: "Shononoki",
      icono: "🎵",
      links: [
        { plataforma: "Itch.io", url: "https://shononoki.itch.io/bullet-hell-music-pack" }
      ]
    },
    {
      id: 5,
      tipo: "Sound Effects",
      nombre: "8-Bit / 16-Bit Sound Effects Pack",
      autor: "JDWasabi",
      icono: "🔊",
      links: [
        { plataforma: "X.com", url: "https://x.com/JDWasabi" },
        { plataforma: "Itch.io", url: "https://jdwasabi.itch.io/8-bit-16-bit-sound-effects-pack" }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 text-texto">
      
      {/* Encabezado */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primario tracking-tight">
          Agradecimientos ✨
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600">
          Este proyecto ha sido posible gracias al increíble trabajo de la comunidad y el uso de los siguientes recursos gratuitos.
        </p>
      </div>
      
      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {recursos.map((recurso) => (
          <div 
            key={recurso.id} 
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-primario/30 transition-all duration-300 flex flex-col"
          >
            {/* Parte Superior: Icono, Tipo y Título */}
            <div className="flex items-start gap-4 mb-3">
              <div className="text-4xl bg-gray-50 border border-gray-100 p-3 rounded-xl flex-shrink-0 shadow-sm">
                {recurso.icono}
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primario">
                  {recurso.tipo}
                </span>
                <h2 className="text-lg font-bold leading-tight mt-1 text-gray-800">
                  {recurso.nombre}
                </h2>
              </div>
            </div>

            {/* Autor alineado a la derecha */}
            <div className="text-right mb-4">
              <p className="text-sm text-gray-600 inline-block bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                Creado por <strong className="font-semibold text-primario">{recurso.autor}</strong>
              </p>
            </div>
            
            {/* Sección de enlaces */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2">
                Enlaces del autor:
              </p>
              <div className="flex flex-wrap gap-2">
                {recurso.links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-primario/10 text-primario hover:bg-primario hover:text-white transition-colors border border-primario/20"
                  >
                    {link.plataforma}
                  </a>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}