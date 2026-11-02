import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../types/index.js';
import api from '../services/api.js';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Plus, 
  Info,
  Building
} from 'lucide-react';

export const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  const fetchMyReservations = async () => {
    try {
      const data = await api.getMyReservations();
      setReservations(data);
    } catch (err: any) {
      setActionError(err.message || 'Error al cargar tus reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.')) {
      return;
    }

    setCancellingId(id);
    setActionError('');
    try {
      await api.cancelReservation(id);
      await fetchMyReservations();
    } catch (err: any) {
      setActionError(err.message || 'Error al cancelar la reserva');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmada
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            <XCircle className="w-3.5 h-3.5" /> Cancelada
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Finalizada
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const filtered = reservations.filter((r) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') return r.status === 'CONFIRMED' || r.status === 'PENDING';
    if (filterStatus === 'CANCELLED') return r.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mis Reservas</h1>
          <p className="mt-1 text-sm text-slate-600">
            Consulta el historial y estado de todos tus espacios reservados.
          </p>
        </div>
        <Link
          to="/spaces"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Reserva
        </Link>
      </div>

      {actionError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3 mb-6">
        {[
          { key: 'ALL', label: 'Todas' },
          { key: 'ACTIVE', label: 'Activas' },
          { key: 'CANCELLED', label: 'Canceladas' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reservation List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No hay reservas registradas</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Aún no tienes reservaciones registradas con este filtro.
          </p>
          <Link
            to="/spaces"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Explorar espacios disponibles
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((r) => {
              const canCancel = r.status === 'CONFIRMED' || r.status === 'PENDING';

              return (
                <div
                  key={r.id}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {r.space?.name || 'Espacio'}
                      </h3>
                      {getStatusBadge(r.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>{r.reservationDate}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{r.startTime} - {r.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{r.space?.location}</span>
                      </div>
                    </div>

                    {r.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <strong className="text-slate-700">Notas:</strong> {r.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        {cancellingId === r.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
