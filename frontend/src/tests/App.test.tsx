import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Footer } from '../components/Footer.js';
import { AuthProvider } from '../context/AuthContext.js';

describe('Frontend Component Tests', () => {
  it('renders Navbar with ReserveHub brand and navigation links', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Reserve/i)).toBeDefined();
    expect(screen.getByText(/Hub/i)).toBeDefined();
    expect(screen.getByText(/Espacios/i)).toBeDefined();
    expect(screen.getByText(/Iniciar sesión/i)).toBeDefined();
  });

  it('renders Footer with Universidad Rafael Landivar and all team members', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    expect(screen.getByText(/Universidad Rafael Landívar/i)).toBeDefined();
    expect(screen.getByText(/Jonathan García — 1045222/i)).toBeDefined();
    expect(screen.getByText(/Giancarlo Ortega — 1230222/i)).toBeDefined();
    expect(screen.getByText(/Mario López — 2477123/i)).toBeDefined();
  });
});
