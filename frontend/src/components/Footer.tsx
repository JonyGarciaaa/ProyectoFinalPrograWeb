import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-lg mb-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span>ReserveHub</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Plataforma web universitaria para la reserva y gestión eficiente de espacios, aulas y auditorios.
            </p>
            <p className="text-xs text-slate-500 mt-3">
              Universidad Rafael Landívar — Facultad de Ingeniería.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Integrantes del Equipo</h4>
            <ul className="text-xs sm:text-sm space-y-1 text-slate-400">
              <li>Walter José Herrera Salvatierra — 1109722</li>
              <li>Boris Garzona — 1218122</li>
              <li>Jonathan García — 1045222</li>
              <li>Samuel Ruiz — 1228722</li>
              <li>Giancarlo Ortega — 1230222</li>
              <li>Mario López — 2477123</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Seguridad & Rendimiento</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Desarrollado bajo estándares OWASP con autenticación JWT, cifrado bcrypt y validación estricta de esquemas de datos.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Arquitectura Segura y Contenerizada</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 ReserveHub. Proyecto Final de Programación Web.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Catedrático: Ing. Ronald Leonel Ayala Garrido
          </p>
        </div>
      </div>
    </footer>
  );
};
