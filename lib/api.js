// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to get auth token
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Helper to detect current site language from URL path (client-side only)
const getCurrentLang = () => {
  if (typeof window === 'undefined') return 'en';
  const path = window.location.pathname || '';
  const match = path.match(/^\/(en|ar)(?:\/|$)/);
  return match ? match[1] : 'en';
};

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Pass site language to API so backend can return localized messages
    'Accept-Language': getCurrentLang(),
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(options.auth !== false),
      ...options.headers,
    },
  };

  try {
    console.debug('[apiCall] request', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body,
    });

    const response = await fetch(url, config);
    const status = response.status;
    let data;

    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    console.debug('[apiCall] response', { url, status, data });

    if (!response.ok) {
      throw {
        status,
        message: data?.message || data?.error || 'An error occurred',
        errors: data?.errors || null,
        code: data?.code || null,
      };
    }

    return data;
  } catch (error) {
    // Normalize thrown errors into an Error instance with helpful properties
    // Log both the object and a JSON snapshot for deeper debugging visibility
    try {
      console.error('API Error:', error, JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (logErr) {
      console.error('API Error (failed to stringify):', error);
    }

    const normalizedMessage = error?.message || (typeof error === 'object' && Object.keys(error).length ? JSON.stringify(error) : 'Unexpected API error');
    const err = new Error(normalizedMessage);
    err.status = error?.status ?? null;
    err.errors = error?.errors ?? null;
    err.code = error?.code ?? null;
    err.original = error ?? null;
    // Preserve stack if present
    if (error?.stack) err.stack = error.stack;

    throw err;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    return apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      auth: false,
    });
  },

  // Check if an email already exists (used for client-side pre-check)
  emailExists: async (email) => {
    return apiCall(`/users/exists?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      auth: false,
    });
  },

  login: async (credentials) => {
    return apiCall('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      auth: false,
    });
  },

  // Send OTP to phone number
  sendOtp: async (phone, type = 'login') => {
    return apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, type }),
      auth: false,
    });
  },

  // Verify OTP code and get auth token
  verifyOtp: async (phone, code, type = 'login') => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, code, type }),
      auth: false,
    });
  },

  // Reset password using OTP
  resetPassword: async (phone, code, password, password_confirmation) => {
    return apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ phone, code, password, password_confirmation }),
      auth: false,
    });
  },

  logout: async () => {
    return apiCall('/logout', {
      method: 'POST',
    });
  },

  getUser: async () => {
    return apiCall('/user', {
      method: 'GET',
    });
  },

  updateProfile: async (userData) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Trips API
export const tripsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/trips?${params}`, { auth: false });
  },

  getBySlug: async (slug) => {
    return apiCall(`/trips/${slug}`, { auth: false });
  },
};

// Offers API
export const offersAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/offers?${params}`, { auth: false });
  },

  getById: async (id) => {
    return apiCall(`/offers/${id}`, { auth: false });
  },
};

// (helper exports are already exported above)

// Bookings API
export const bookingsAPI = {
  getAll: async () => {
    return apiCall('/bookings', {
      method: 'GET',
    });
  },

  create: async (bookingData) => {
    return apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  createGuest: async (bookingData) => {
    // If an auth token is present, include auth header so guest bookings submitted by
    // logged-in users are attached to their account (user_id set server-side).
    const hasToken = !!getToken();
    return apiCall('/bookings/guest', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      auth: hasToken ? true : false,
    });
  },

  getById: async (id) => {
    return apiCall(`/bookings/${id}`, {
      method: 'GET',
    });
  },

  update: async (id, bookingData) => {
    return apiCall(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  cancel: async (id) => {
    return apiCall(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  checkStatus: async (id) => {
    return apiCall(`/bookings/${id}/status`, {
      method: 'GET',
      auth: false,
    });
  },
};

// Payments API
export const paymentsAPI = {
  getAll: async () => {
    return apiCall('/payments', {
      method: 'GET',
    });
  },

  initiate: async (paymentData) => {
    return apiCall('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  getById: async (id) => {
    return apiCall(`/payments/${id}`, {
      method: 'GET',
    });
  },

  callback: async (paymentId, status) => {
    return apiCall(`/payments/callback?id=${paymentId}&status=${status}`, {
      method: 'GET',
      auth: false,
    });
  },
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    return apiCall('/settings', { auth: false });
  },

  getByKey: async (key) => {
    return apiCall(`/settings/${key}`, { auth: false });
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async () => {
    return apiCall('/testimonials', { auth: false });
  },
};

// Team Members API
export const teamAPI = {
  getAll: async () => {
    return apiCall('/team-members', { auth: false });
  },
};

// Contact API - for contact form submissions
export const contactAPI = {
  submit: async (contactData) => {
    return apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
      auth: false,
    });
  },
};

// ============================================
// RESERVATION SYSTEM (Phase 1 - No Auth Required)
// ============================================
export const reservationsAPI = {
  /**
   * Submit a new reservation (no login required)
   * @param {Object} reservationData - Reservation details
   * @param {string} reservationData.name - Customer name (required)
   * @param {string} reservationData.email - Customer email (required)
   * @param {string} reservationData.phone - Customer phone (optional)
   * @param {string} reservationData.trip_type - school|corporate|family|private
   * @param {string} reservationData.trip_slug - Trip identifier
   * @param {string} reservationData.trip_title - Trip display name
   * @param {string} reservationData.preferred_date - YYYY-MM-DD format
   * @param {number} reservationData.guests - Number of guests
   * @param {string} reservationData.notes - Additional notes
   */
  submit: async (reservationData) => {
    return apiCall('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
      auth: false, // No authentication required
    });
  },

  /**
   * Check reservation status by email and reservation ID
   * @param {string} email - Customer email
   * @param {number} reservationId - Reservation ID
   */
  checkStatus: async (email, reservationId) => {
    return apiCall('/reservations/check-status', {
      method: 'POST',
      body: JSON.stringify({ email, reservation_id: reservationId }),
      auth: false,
    });
  },

  /**
   * Get authenticated user's reservations (by email)
   */
  getMyReservations: async () => {
    return apiCall('/my-reservations', {
      method: 'GET',
    });
  },
};
