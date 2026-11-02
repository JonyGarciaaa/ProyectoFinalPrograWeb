import React, { useEffect, useState } from 'react';
import { Space, Reservation, User } from '../types/index.js';
import api from '../services/api.js';
import { 
  Building, 
  Calendar, 
  Users, 
  Plus, 
  Edit3, 
  Power, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  X,
  Search
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'spaces' | 'users'>('reservations');
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Space modal state
  const [isSpaceModalOpen, setIsSpaceModalOpen] = useState(false);
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [spaceFormData, setSpaceFormData] = useState({
    name: '',
    description: '',
    location: '',
    capacity: 20,
    imageUrl: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resData, spData, usData] = await Promise.all([
        api.getAllReservations(),
        api.getSpaces(true), // include inactive spaces for admin
        api.getAllUsers(),
      ]);
      setReservations(resData);
      setSpaces(spData);
      setUsers(usData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos administrativos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (reservationId: string, newStatus: string) => {
    try {
      await api.updateReservationStatus(reservationId, newStatus);
      setSuccessMsg('Estado de la reserva actualizado exitosamente');
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado');
    }
  };

  const handleToggleSpace = async (spaceId: string) => {
    try {
      await api.toggleSpaceStatus(spaceId);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error al alternar estado del espacio');
    }
  };

  const handleOpenCreateSpace = () => {
    setEditingSpaceId(null);
    setSpaceFormData({
      name: '',
      description: '',
      location: '',
      capacity: 20,
      imageUrl: '',
      status: 'ACTIVE',
    });
    setIsSpaceModalOpen(true);
  };

  const handleOpenEditSpace = (space: Space) => {
    setEditingSpaceId(space.id);
    setSpaceFormData({
      name: space.name,
      description: space.description,
      location: space.location,
      capacity: space.capacity,
      imageUrl: space.imageUrl || '',
      status: space.status,
    });
    setIsSpaceModalOpen(true);
  };

  const handleSaveSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSpaceId) {
        await api.updateSpace(editingSpaceId, spaceFormData);
        setSuccessMsg('Espacio actualizado correctamente');
      } else {
        await api.createSpace(spaceFormData);
        setSuccessMsg('Nuevo espacio registrado correctamente');
      }
      setIsSpaceModalOpen(false);
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar espacio');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            Panel de Control
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Panel de Administración
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Administración centralizada de espacios, horarios, usuarios y solicitudes de reserva.
          </p>
        </div>

        {activeTab === 'spaces' && (
          <button
            onClick={handleOpenCreateSpace}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Espacio
          </button>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'reservations'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Reservas ({reservations.length})
        </button>

        <button
          onClick={() => setActiveTab('spaces')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'spaces'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Espacios ({spaces.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuarios ({users.length})
        </button>
      </div>

      {/* Tab 1: Reservations Management */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
              Todas las Reservaciones Registradas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Espacio</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Horario</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{r.user?.name}</div>
                      <div className="text-xs text-slate-400 font-normal">{r.user?.email}</div>
                    </td>
                    <td className="py-3.5 px-4">{r.space?.name}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">{r.reservationDate}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {r.startTime} - {r.endTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          r.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {r.status !== 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(r.id, 'CONFIRMED')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                      {r.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleStatusChange(r.id, 'CANCELLED')}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                      {r.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleStatusChange(r.id, 'COMPLETED')}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Finalizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Spaces Management */}
      {activeTab === 'spaces' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((sp) => (
            <div
              key={sp.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                sp.status === 'ACTIVE' ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{sp.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sp.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sp.status === 'ACTIVE' ? 'Activo' : 'Deshabilitado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{sp.location}</p>
                <p className="text-xs font-semibold text-slate-700 mb-3">
                  Capacidad: {sp.capacity} personas
                </p>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4">{sp.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEditSpace(sp)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>

                <button
                  onClick={() => handleToggleSpace(sp.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors ${
                    sp.status === 'ACTIVE'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {sp.status === 'ACTIVE' ? 'Deshabilitar' : 'Habilitar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Reservas Hechas</th>
                  <th className="py-3 px-4">Fecha Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{u._count?.reservations || 0}</td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Space Create / Edit Modal */}
      {isSpaceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                {editingSpaceId ? 'Editar Espacio' : 'Registrar Nuevo Espacio'}
              </h3>
              <button
                onClick={() => setIsSpaceModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpace} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nombre del Espacio
                </label>
                <input
                  type="text"
                  required
                  value={spaceFormData.name}
                  onChange={(e) => setSpaceFormData({ ...spaceFormData, name: e.target.value })}
                  placeholder="Ej. Auditorio Central"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  required
                  value={spaceFormData.location}
                  onChange={(e) => setSpaceFormData({ ...spaceFormData, location: e.target.value })}
                  placeholder="Ej. Edificio T, Nivel 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Capacidad (Personas)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={spaceFormData.capacity}
                    onChange={(e) =>
                      setSpaceFormData({ ...spaceFormData, capacity: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Estado
                  </label>
                  <select
                    value={spaceFormData.status}
                    onChange={(e) =>
                      setSpaceFormData({
                        ...spaceFormData,
                        status: e.target.value as 'ACTIVE' | 'INACTIVE',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none bg-white"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Deshabilitado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  URL de Imagen (Opcional)
                </label>
                <input
                  type="url"
                  value={spaceFormData.imageUrl}
                  onChange={(e) => setSpaceFormData({ ...spaceFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Descripción y Equipamiento
                </label>
                <textarea
                  rows={3}
                  required
                  value={spaceFormData.description}
                  onChange={(e) =>
                    setSpaceFormData({ ...spaceFormData, description: e.target.value })
                  }
                  placeholder="Detalles sobre equipo multimedia, pizarras, tomas de corriente..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSpaceModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  {editingSpaceId ? 'Guardar Cambios' : 'Registrar Espacio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
