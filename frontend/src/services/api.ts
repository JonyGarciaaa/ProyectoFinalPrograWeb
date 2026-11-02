const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('reservehub_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Error al procesar la respuesta del servidor.',
    }));

    if (!response.ok) {
      let errorMessage = data.message || `Error en la solicitud (${response.status})`;
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage += ': ' + data.errors.map((e: any) => e.message).join(', ');
      }
      throw new Error(errorMessage);
    }

    return data.data;
  }

  // Auth
  async register(body: { name: string; email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async login(body: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  async getAllUsers() {
    return this.request<any[]>('/auth/users');
  }

  // Spaces
  async getSpaces(includeInactive = false) {
    return this.request<any[]>(`/spaces?includeInactive=${includeInactive}`);
  }

  async getSpace(id: string) {
    return this.request<any>(`/spaces/${id}`);
  }

  async createSpace(data: any) {
    return this.request<any>('/spaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSpace(id: string, data: any) {
    return this.request<any>(`/spaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleSpaceStatus(id: string) {
    return this.request<any>(`/spaces/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  async deleteSpace(id: string) {
    return this.request<any>(`/spaces/${id}`, {
      method: 'DELETE',
    });
  }

  async getAvailability(spaceId: string, date: string) {
    return this.request<any>(`/spaces/${spaceId}/availability?date=${date}`);
  }

  // Reservations
  async createReservation(data: {
    spaceId: string;
    reservationDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) {
    return this.request<any>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyReservations() {
    return this.request<any[]>('/reservations/my');
  }

  async getAllReservations() {
    return this.request<any[]>('/reservations');
  }

  async updateReservationStatus(id: string, status: string, notes?: string) {
    return this.request<any>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  async cancelReservation(id: string) {
    return this.request<any>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
export default api;
