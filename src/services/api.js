// ========================================================
// API CLIENT SERVICE FOR DYARI DIGITAL STORE
// Handles communication between React Frontend and Node/PostgreSQL Backend
// ========================================================

const API_BASE_URL = '/api';

// Helper for fetch with Authorization header
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('dyari_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};

export const api = {
  // Check backend server status
  checkHealth: async () => {
    try {
      const res = await apiFetch('/health');
      return res.status === 'OK';
    } catch {
      return false;
    }
  },

  // Auth API
  auth: {
    login: async (email, password) => {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) {
        localStorage.setItem('dyari_auth_token', res.token);
      }
      return res;
    },
    register: async (userData) => {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.token) {
        localStorage.setItem('dyari_auth_token', res.token);
      }
      return res;
    },
    me: async () => {
      return apiFetch('/auth/me');
    },
    logout: () => {
      localStorage.removeItem('dyari_auth_token');
    }
  },

  // Products API
  products: {
    getAll: async (category = 'semua', search = '') => {
      let query = `?category=${encodeURIComponent(category)}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      return apiFetch(`/products${query}`);
    },
    getById: async (id) => {
      return apiFetch(`/products/${id}`);
    },
    create: async (productData) => {
      return apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
    },
    update: async (id, productData) => {
      return apiFetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
    },
    delete: async (id) => {
      return apiFetch(`/products/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Licenses API
  licenses: {
    getAll: async () => {
      return apiFetch('/licenses');
    },
    validate: async (licenseKey) => {
      return apiFetch('/licenses/validate', {
        method: 'POST',
        body: JSON.stringify({ license_key: licenseKey })
      });
    },
    generate: async (licenseData) => {
      return apiFetch('/licenses/generate', {
        method: 'POST',
        body: JSON.stringify(licenseData)
      });
    },
    updateStatus: async (id, status) => {
      return apiFetch(`/licenses/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    }
  },

  // Orders / Transactions API
  orders: {
    getAll: async () => {
      return apiFetch('/orders');
    },
    create: async (orderData) => {
      return apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    },
    updateStatus: async (id, status) => {
      return apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    }
  },

  // Members API
  members: {
    getAll: async () => {
      return apiFetch('/members');
    },
    updateStatus: async (id, status) => {
      return apiFetch(`/members/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    }
  },

  // Settings API
  settings: {
    get: async () => {
      return apiFetch('/settings');
    },
    update: async (settingsData) => {
      return apiFetch('/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings: settingsData })
      });
    }
  }
};

export default api;
