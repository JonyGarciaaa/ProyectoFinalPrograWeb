import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Space } from '../types/index.js';
import api from '../services/api.js';
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  CalendarDays,
  ShieldCheck,
  Building
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSpaces = async () => {
      try {
        const data = await api.getSpaces();
        setSpaces(data.slice(0, 3)); // 3 featured spaces
      } catch (err) {
        console.error('Failed to load featured spaces:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedSpaces();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-blue-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistema Oficial de Reservas Universitarias
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Reserva un espacio <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-white">
              fácilmente y sin conflictos
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-300 leading-relaxed font-normal">
            Consulta disponibilidad en tiempo real, selecciona el horario que necesitas y confirma tu reservación en segundos.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/spaces"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group transition-all"
            >
              Ver Espacios Disponibles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/my-reservations"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 font-semibold rounded-xl border border-white/20 transition-all text-center"
            >
              Consultar Mis Reservas
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Validación de Horarios</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Algoritmo que previene solapamientos y reservas duplicadas en el mismo horario.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Disponibilidad Inmediata</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Revisa franjas horarias libres por fecha específica de manera gráfica.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Control & Seguridad</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Autenticación segura por roles (Estudiante/Profesor y Administrador).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spaces Carousel/List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Explora las instalaciones
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Espacios Destacados
            </h2>
          </div>
          <Link
            to="/spaces"
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Ver todos los espacios <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={space.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Cap. {space.capacity}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {space.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {space.location}
                    </p>
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                      {space.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Disponible
                    </span>
                    <Link
                      to={`/reserve/${space.id}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                    >
                      Reservar ahora
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
