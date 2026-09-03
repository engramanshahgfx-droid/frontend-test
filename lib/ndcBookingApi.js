/**
 * akbar Booking API Client
 * 
 * Single source of truth for all akbar booking API calls.
 * This connects frontend to backend unified booking flow.
 * 
 * Flow: Search → Select → Passengers → Payment → Confirm → Ticket
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Store auth token (get from login)
let authToken = null;

/**
 * Set authentication token (call after user login)
 */
export const setAuthToken = (token) => {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  if (authToken) return authToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
};

// ============================================================================
// STEP 1: SEARCH FLIGHTS (Public - no auth needed)
// ============================================================================

/**
 * Search for available flights
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.origin - Origin airport code (e.g., "RUH")
 * @param {string} params.destination - Destination airport code (e.g., "JED")
 * @param {string} params.departureDate - Departure date (YYYY-MM-DD)
 * @param {string} [params.returnDate] - Return date for round trip
 * @param {number} [params.adults=1] - Number of adult passengers
 * @param {number} [params.children=0] - Number of child passengers
 * @param {number} [params.infants=0] - Number of infant passengers
 * @param {string} [params.cabinClass='economy'] - Cabin class
 * @returns {Promise<Object>} - Flight offers
 */
export const searchFlights = async (params) => {
  // Use test endpoint for local development
  const isTestMode = process.env.NEXT_PUBLIC_akbar_TEST_MODE === 'true';
  const endpoint = isTestMode
    ? '/local-test/akbar/search'  // Mock API for testing
    : '/akbar/flights/available-offers';  // Real akbar API

  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departureDate,
      return_date: params.returnDate,
      adults: params.adults || 1,
      children: params.children || 0,
      infants: params.infants || 0,
      cabin_class: params.cabinClass || 'economy',
    }),
  });
};

// ============================================================================
// STEP 2: GET BUNDLES/FARE OPTIONS (Public)
// ============================================================================

/**
 * Get available bundles/fares for a flight offer
 * 
 * @param {string} offerId - The offer ID from search results
 * @returns {Promise<Object>} - Available bundles
 */
export const getFlightBundles = async (offerId) => {
  const isTestMode = process.env.NEXT_PUBLIC_akbar_TEST_MODE === 'true';
  const endpoint = isTestMode
    ? `/local-test/akbar/bundles/${offerId}`
    : `/akbar/flights/bundle-options`;

  if (isTestMode) {
    return apiRequest(endpoint, { method: 'GET' });
  }

  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify({ offer_id: offerId }),
  });
};

// ============================================================================
// STEP 3: START BOOKING (Protected - requires auth)
// ============================================================================

/**
 * Start a new booking (creates booking in database)
 * This is IDEMPOTENT - calling twice with same data returns same booking
 * 
 * @param {string} offerId - Selected offer ID
 * @param {Object} flightData - Flight details to store
 * @returns {Promise<Object>} - Booking reference and details
 */
export const startBooking = async (offerId, flightData) => {
  return apiRequest('/v2/akbar/bookings/start', {
    method: 'POST',
    body: JSON.stringify({
      offer_id: offerId,
      flight_data: flightData,
    }),
  });
};

// ============================================================================
// STEP 4: ADD PASSENGERS (Protected)
// ============================================================================

/**
 * Add passengers to booking
 * Handles deduplication - same passenger won't be added twice
 * 
 * @param {string} orderReference - Booking reference from startBooking
 * @param {Array} passengers - Array of passenger objects
 * @returns {Promise<Object>} - Updated booking with passengers
 * 
 * Passenger object structure:
 * {
 *   type: 'ADT' | 'CHD' | 'INF',
 *   title: 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Master',
 *   first_name: string,
 *   middle_name?: string,
 *   last_name: string,
 *   birth_date: 'YYYY-MM-DD',
 *   nationality: string (country code),
 *   email?: string,
 *   phone?: string,
 *   document_type: 'passport' | 'national_id',
 *   document_number: string,
 *   document_expiry: 'YYYY-MM-DD',
 *   document_country: string (country code),
 * }
 */
export const addPassengers = async (orderReference, passengers) => {
  return apiRequest('/v2/akbar/bookings/passengers', {
    method: 'POST',
    body: JSON.stringify({
      order_reference: orderReference,
      passengers: passengers,
    }),
  });
};

// ============================================================================
// STEP 5: HOLD FLIGHT (Optional - Protected)
// ============================================================================

/**
 * Hold the flight (optional step before payment)
 * Reserves the flight for a limited time
 * 
 * @param {string} orderReference - Booking reference
 * @returns {Promise<Object>} - Hold confirmation with expiry time
 */
export const holdFlight = async (orderReference) => {
  return apiRequest('/v2/akbar/bookings/hold', {
    method: 'POST',
    body: JSON.stringify({
      order_reference: orderReference,
    }),
  });
};

// ============================================================================
// STEP 6: PROCESS PAYMENT (Protected)
// ============================================================================

/**
 * Process payment for booking
 * 
 * @param {string} orderReference - Booking reference
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} - Payment result
 */
export const processPayment = async (orderReference, paymentData) => {
  return apiRequest('/v2/akbar/bookings/pay', {
    method: 'POST',
    body: JSON.stringify({
      order_reference: orderReference,
      payment_method: paymentData.method || 'creditcard',
      card_token: paymentData.cardToken,
      amount: paymentData.amount,
      add_insurance: paymentData.addInsurance || false,
    }),
  });
};

// ============================================================================
// STEP 7: CONFIRM BOOKING (Protected)
// ============================================================================

/**
 * Confirm booking with akbar after payment
 * 
 * @param {string} orderReference - Booking reference
 * @returns {Promise<Object>} - Confirmation with PNR
 */
export const confirmBooking = async (orderReference) => {
  return apiRequest('/v2/akbar/bookings/confirm', {
    method: 'POST',
    body: JSON.stringify({
      order_reference: orderReference,
    }),
  });
};

// ============================================================================
// STEP 8: ISSUE TICKET (Protected)
// ============================================================================

/**
 * Issue e-ticket for confirmed booking
 * 
 * @param {string} orderReference - Booking reference
 * @returns {Promise<Object>} - Ticket numbers
 */
export const issueTicket = async (orderReference) => {
  return apiRequest('/v2/akbar/bookings/issue-ticket', {
    method: 'POST',
    body: JSON.stringify({
      order_reference: orderReference,
    }),
  });
};

// ============================================================================
// UTILITY: GET BOOKING DETAILS (Protected)
// ============================================================================

/**
 * Get booking details by reference
 * 
 * @param {string} orderReference - Booking reference
 * @returns {Promise<Object>} - Full booking details
 */
export const getBookingDetails = async (orderReference) => {
  return apiRequest(`/v2/akbar/bookings/${orderReference}`, {
    method: 'GET',
  });
};

// ============================================================================
// UTILITY: LIST USER BOOKINGS (Protected)
// ============================================================================

/**
 * Get all bookings for current user
 * 
 * @param {Object} [params] - Filter parameters
 * @returns {Promise<Object>} - List of bookings
 */
export const listBookings = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/v2/akbar/bookings${queryString ? '?' + queryString : ''}`, {
    method: 'GET',
  });
};

// ============================================================================
// UTILITY: CANCEL BOOKING (Protected)
// ============================================================================

/**
 * Cancel a booking
 * 
 * @param {string} orderReference - Booking reference
 * @param {string} [reason] - Cancellation reason
 * @returns {Promise<Object>} - Cancellation confirmation
 */
export const cancelBooking = async (orderReference, reason) => {
  return apiRequest('/v2/akbar/bookings/cancel', {
    method: 'POST',
    body: JSON.stringify({
      order_reference: orderReference,
      reason: reason,
    }),
  });
};

// ============================================================================
// COMPLETE BOOKING FLOW (Convenience function)
// ============================================================================

/**
 * Complete booking flow in one call
 * Useful for testing or simplified checkout
 * 
 * @param {Object} bookingData - All booking data
 * @returns {Promise<Object>} - Final booking with ticket
 */
export const completeBookingFlow = async (bookingData) => {
  const {
    offerId,
    flightData,
    passengers,
    paymentData,
    skipHold = true,
  } = bookingData;

  // Step 1: Start booking
  console.log('📝 Starting booking...');
  const startResult = await startBooking(offerId, flightData);
  const orderReference = startResult.data.order_reference;
  console.log('✅ Booking started:', orderReference);

  // Step 2: Add passengers
  console.log('👥 Adding passengers...');
  await addPassengers(orderReference, passengers);
  console.log('✅ Passengers added');

  // Step 3: Hold (optional)
  if (!skipHold) {
    console.log('⏸️ Holding flight...');
    await holdFlight(orderReference);
    console.log('✅ Flight held');
  }

  // Step 4: Process payment
  console.log('💳 Processing payment...');
  await processPayment(orderReference, paymentData);
  console.log('✅ Payment processed');

  // Step 5: Confirm booking
  console.log('✈️ Confirming booking...');
  await confirmBooking(orderReference);
  console.log('✅ Booking confirmed');

  // Step 6: Issue ticket
  console.log('🎫 Issuing ticket...');
  const ticketResult = await issueTicket(orderReference);
  console.log('✅ Ticket issued');

  // Get final booking details
  const finalBooking = await getBookingDetails(orderReference);

  return {
    success: true,
    orderReference,
    booking: finalBooking.data,
    tickets: ticketResult.data,
  };
};

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Login user and get auth token
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} - User with token
 */
export const login = async (email, password) => {
  const result = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
};

/**
 * Register new user
 * 
 * @param {Object} userData 
 * @returns {Promise<Object>} - User with token
 */
export const register = async (userData) => {
  const result = await apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (result.token) {
    setAuthToken(result.token);
  }

  return result;
};

/**
 * Logout user
 */
export const logout = () => {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// ============================================================================
// EXPORT DEFAULT OBJECT
// ============================================================================

const akbarBookingApi = {
  // Auth
  login,
  register,
  logout,
  setAuthToken,
  getAuthToken,

  // Booking flow
  searchFlights,
  getFlightBundles,
  startBooking,
  addPassengers,
  holdFlight,
  processPayment,
  confirmBooking,
  issueTicket,

  // Utilities
  getBookingDetails,
  listBookings,
  cancelBooking,
  completeBookingFlow,
};

export default akbarBookingApi;
