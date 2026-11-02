import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Space, AvailabilityResponse } from '../types/index.js';
import api from '../services/api.js';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';

export const ReservePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [space, setSpace] = useState<Space | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    searchParams.get('date') || new Date().toISOString().split('T')[0]
  );
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [notes, setNotes] = useState('');
  
  const [loadingSpace, setLoadingSpace] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load space details
  useEffect(() => {
    if (!id) return;
    const fetchSpace = async () => {
      try {
        const data = await api.getSpace(id);
        setSpace(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar detalles del espacio');
      } finally {
        setLoadingSpace(false);
      }
    };
    fetchSpace();
  }, [id]);

  // Load availability when date or space changes
  useEffect(() => {
    if (!id || !selectedDate) return;
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      setError('');
      setSelectedSlot(null);
      try {
        const data = await api.getAvailability(id, selectedDate);
        setAvailability(data);
      } catch (err: any) {
        setError(err.message || 'Error al consultar disponibilidad');
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [id, selectedDate]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setSearchParams({ date: newDate });
  };

  const handleConfirmReservation = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/reserve/${id}?date=${selectedDate}` } } });
      return;
    }

    if (!selectedSlot || !id) {
      setError('Por favor selecciona un horario disponible');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.createReservation({
        spaceId: id,
        reservationDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'No se pudo completar la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSpace) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Espacio no encontrado</h2>
        <Link to="/spaces" className="mt-4 inline-block text-indigo-600 font-semibold">
          ← Volver al catálogo de espacios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Back button */}
      <Link
        to="/spaces"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a espacios
      </Link>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">¡Reserva Confirmada!</h3>
            <p className="text-sm text-slate-600 mt-2">
              Tu reserva para <strong>{space.name}</strong> ha sido registrada con éxito en el sistema.
            </p>
            <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div><strong className="text-slate-700">Fecha:</strong> {selectedDate}</div>
              <div>
                <strong className="text-slate-700">Horario:</strong> {selectedSlot?.startTime} - {selectedSlot?.endTime}
              </div>
              <div><strong className="text-slate-700">Ubicación:</strong> {space.location}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/my-reservations')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
              >
                Ver Mis Reservas
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setSelectedSlot(null);
                  setNotes('');
                }}
                className="w-full py-2.5 text-slate-600 hover:text-slate-900 font-semibold text-xs"
              >
                Hacer otra reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Space Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-44 bg-slate-100">
              <img
                src={
                  space.imageUrl ||
                  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
                }
                alt={space.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 space-y-3">
              <h2 className="text-xl font-bold text-slate-900">{space.name}</h2>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{space.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Capacidad: {space.capacity} personas</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                {space.description}
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-indigo-600" />
              Regla de Reserva (RN-01)
            </div>
            <p className="text-indigo-700 leading-relaxed">
              El sistema garantiza que no existan reservas duplicadas o solapadas para este espacio.
            </p>
          </div>
        </div>

        {/* Right Column: Reservation Workflow */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Realizar Reserva</h1>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Selecciona la Fecha
              </label>
              <div className="relative rounded-xl shadow-sm max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Step 2: Time Slots */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Horarios Disponibles
                </label>
                {availability?.schedule && (
                  <span className="text-xs text-slate-400">
                    Horario: {availability.schedule.openingTime} - {availability.schedule.closingTime}
                  </span>
                )}
              </div>

              {loadingAvailability ? (
                <div className="py-8 text-center text-sm text-slate-400 animate-pulse">
                  Consultando disponibilidad del espacio...
                </div>
              ) : !availability?.isOpen ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{availability?.message || 'El espacio está cerrado en la fecha seleccionada.'}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availability.slots.map((slot, index) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime &&
                      selectedSlot?.endTime === slot.endTime;

                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                          !slot.isAvailable
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                            : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-700 hover:bg-indigo-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <span className="text-[10px] mt-1 font-bold">
                          {slot.isAvailable ? 'Disponible' : 'Ocupado'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Observations / Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                3. Observaciones / Motivo (Opcional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Reunión de proyecto de graduación, clase de repaso, etc."
                className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>

            {/* Confirm Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {selectedSlot ? (
                  <span>
                    Seleccionado: <strong>{selectedDate}</strong> de{' '}
                    <strong>{selectedSlot.startTime} a {selectedSlot.endTime}</strong>
                  </span>
                ) : (
                  <span>Por favor selecciona un horario para continuar</span>
                )}
              </div>
              <button
                type="button"
                disabled={!selectedSlot || submitting}
                onClick={handleConfirmReservation}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all text-sm"
              >
                {submitting ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
