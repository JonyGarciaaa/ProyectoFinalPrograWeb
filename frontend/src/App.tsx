import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

import { HomePage } from './pages/HomePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { SpacesPage } from './pages/SpacesPage.js';
import { ReservePage } from './pages/ReservePage.js';
import { MyReservationsPage } from './pages/MyReservationsPage.js';
import { AdminPage } from './pages/AdminPage.js';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Pantalla 1: Inicio */}
              <Route path="/" element={<HomePage />} />

              {/* Pantalla 2: Iniciar sesión */}
              <Route path="/login" element={<LoginPage />} />

              {/* Pantalla 3: Registro */}
              <Route path="/register" element={<RegisterPage />} />

              {/* Pantalla 4: Catálogo de espacios */}
              <Route path="/spaces" element={<SpacesPage />} />

              {/* Pantalla 5: Realizar reserva */}
              <Route path="/reserve/:id" element={<ReservePage />} />

              {/* Pantalla 6: Mis reservas (Ruta protegida para usuario) */}
              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <MyReservationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Pantalla 7: Panel de administración (Ruta protegida para admin) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
