'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import ndcBookingApi from './ndcBookingApi';

/**
 * NDC Booking Context
 * 
 * Single source of truth for booking state across all pages.
 * Replaces scattered localStorage usage with clean state management.
 */

const BookingContext = createContext(null);

// Booking flow steps
export const BOOKING_STEPS = {
  SEARCH: 'search',
  SELECT_FLIGHT: 'select_flight',
  PASSENGERS: 'passengers',
  EXTRAS: 'extras',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
};

// Initial state
const initialState = {
  // Current step
  currentStep: BOOKING_STEPS.SEARCH,
  
  // Search params
  searchParams: null,
  
  // Flight data
  searchResults: null,
  selectedFlight: null,
  selectedBundle: null,
  
  // Booking data (from backend)
  orderReference: null,
  bookingStatus: null,
  
  // Passengers
  passengers: [],
  
  // Extras/add-ons
  extras: {
    insurance: false,
    autoCheckin: false,
    delayProtection: false,
    cancellationFreedom: false,
    baggageRecovery: false,
  },
  
  // Payment
  paymentData: null,
  paymentStatus: null,
  
  // Confirmation
  confirmation: null,
  tickets: null,
  
  // UI state
  loading: false,
  error: null,
};

export function BookingProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Load auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      ndcBookingApi.setAuthToken(token);
    }
  }, []);

  // ========================================
  // STATE HELPERS
  // ========================================

  const setLoading = (loading) => {
    setState(prev => ({ ...prev, loading, error: null }));
  };

  const setError = (error) => {
    setState(prev => ({ ...prev, loading: false, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const setStep = (step) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  // ========================================
  // STEP 1: SEARCH FLIGHTS
  // ========================================

  const searchFlights = async (params) => {
    setLoading(true);
    try {
      const result = await ndcBookingApi.searchFlights(params);
      setState(prev => ({
        ...prev,
        loading: false,
        searchParams: params,
        searchResults: result.data?.offers || result.data,
        currentStep: BOOKING_STEPS.SELECT_FLIGHT,
      }));
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // STEP 2: SELECT FLIGHT & BUNDLE
  // ========================================

  const selectFlight = async (flight, bundle = null) => {
    setState(prev => ({
      ...prev,
      selectedFlight: flight,
      selectedBundle: bundle,
    }));
  };

  const selectBundle = async (bundle) => {
    setState(prev => ({
      ...prev,
      selectedBundle: bundle,
    }));
  };

  // ========================================
  // STEP 3: START BOOKING (creates in DB)
  // ========================================

  const startBooking = async () => {
    if (!state.selectedFlight) {
      throw new Error('No flight selected');
    }

    setLoading(true);
    try {
      const result = await ndcBookingApi.startBooking(
        state.selectedFlight.id,
        {
          ...state.selectedFlight,
          bundle: state.selectedBundle,
          searchParams: state.searchParams,
        }
      );

      setState(prev => ({
        ...prev,
        loading: false,
        orderReference: result.data.order_reference,
        bookingStatus: result.data.booking_status || 'draft',
        currentStep: BOOKING_STEPS.PASSENGERS,
      }));

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // STEP 4: ADD PASSENGERS
  // ========================================

  const addPassengers = async (passengers) => {
    if (!state.orderReference) {
      // If no booking yet, start one first
      await startBooking();
    }

    setLoading(true);
    try {
      const formattedPassengers = passengers.map(p => ({
        type: p.type || 'ADT',
        title: p.title || 'Mr',
        first_name: p.firstName || p.first_name,
        middle_name: p.middleName || p.middle_name,
        last_name: p.lastName || p.last_name,
        birth_date: p.dob || p.birth_date,
        nationality: p.nationality || 'SA',
        email: p.email,
        phone: p.phone,
        document_type: 'passport',
        document_number: p.passport || p.document_number,
        document_expiry: p.passportExpiry || p.document_expiry,
        document_country: p.passportNationality || p.document_country || 'SA',
      }));

      const result = await ndcBookingApi.addPassengers(
        state.orderReference,
        formattedPassengers
      );

      setState(prev => ({
        ...prev,
        loading: false,
        passengers: formattedPassengers,
        bookingStatus: result.data?.booking_status || 'passengers_added',
        currentStep: BOOKING_STEPS.EXTRAS,
      }));

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // STEP 5: SET EXTRAS
  // ========================================

  const setExtras = (extras) => {
    setState(prev => ({
      ...prev,
      extras: { ...prev.extras, ...extras },
    }));
  };

  const proceedToPayment = () => {
    setState(prev => ({
      ...prev,
      currentStep: BOOKING_STEPS.PAYMENT,
    }));
  };

  // ========================================
  // STEP 6: HOLD FLIGHT (Optional)
  // ========================================

  const holdFlight = async () => {
    if (!state.orderReference) {
      throw new Error('No booking to hold');
    }

    setLoading(true);
    try {
      const result = await ndcBookingApi.holdFlight(state.orderReference);
      setState(prev => ({
        ...prev,
        loading: false,
        bookingStatus: 'held',
      }));
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // STEP 7: PROCESS PAYMENT
  // ========================================

  const processPayment = async (paymentData) => {
    if (!state.orderReference) {
      throw new Error('No booking to pay for');
    }

    setLoading(true);
    try {
      const result = await ndcBookingApi.processPayment(
        state.orderReference,
        {
          ...paymentData,
          addInsurance: state.extras.insurance,
        }
      );

      setState(prev => ({
        ...prev,
        loading: false,
        paymentData: result.data,
        paymentStatus: 'paid',
        bookingStatus: 'paid',
      }));

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // STEP 8: CONFIRM BOOKING
  // ========================================

  const confirmBooking = async () => {
    if (!state.orderReference) {
      throw new Error('No booking to confirm');
    }

    setLoading(true);
    try {
      const result = await ndcBookingApi.confirmBooking(state.orderReference);
      setState(prev => ({
        ...prev,
        loading: false,
        bookingStatus: 'confirmed',
        confirmation: result.data,
      }));
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // STEP 9: ISSUE TICKET
  // ========================================

  const issueTicket = async () => {
    if (!state.orderReference) {
      throw new Error('No booking to issue ticket for');
    }

    setLoading(true);
    try {
      const result = await ndcBookingApi.issueTicket(state.orderReference);
      setState(prev => ({
        ...prev,
        loading: false,
        bookingStatus: 'ticketed',
        tickets: result.data,
        currentStep: BOOKING_STEPS.CONFIRMATION,
      }));
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // COMPLETE FLOW (After Payment Success)
  // ========================================

  const completeBookingAfterPayment = async () => {
    setLoading(true);
    try {
      // 1. Confirm with NDC
      await confirmBooking();
      
      // 2. Issue tickets
      await issueTicket();

      setState(prev => ({
        ...prev,
        loading: false,
        currentStep: BOOKING_STEPS.CONFIRMATION,
      }));

      return {
        success: true,
        orderReference: state.orderReference,
      };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // GET BOOKING DETAILS
  // ========================================

  const getBookingDetails = async (orderRef = null) => {
    const reference = orderRef || state.orderReference;
    if (!reference) {
      throw new Error('No booking reference');
    }

    setLoading(true);
    try {
      const result = await ndcBookingApi.getBookingDetails(reference);
      if (!orderRef) {
        setState(prev => ({
          ...prev,
          loading: false,
          ...result.data,
        }));
      }
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // ========================================
  // RESET BOOKING
  // ========================================

  const resetBooking = () => {
    setState(initialState);
  };

  // ========================================
  // CALCULATE TOTALS
  // ========================================

  const calculateTotal = () => {
    let total = 0;

    // Base fare
    if (state.selectedFlight?.price?.total) {
      total += state.selectedFlight.price.total;
    } else if (state.selectedBundle?.price) {
      total += state.selectedBundle.price;
    }

    // Service fee (from config, usually 15 SAR)
    const serviceFee = 15;
    total += serviceFee;

    // Extras
    if (state.extras.insurance) total += 50;
    if (state.extras.autoCheckin) total += 15;
    if (state.extras.delayProtection) total += 25;
    if (state.extras.cancellationFreedom) total += 75;
    if (state.extras.baggageRecovery) total += 20;

    return total;
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {
    // State
    ...state,
    
    // Computed
    total: calculateTotal(),
    isAuthenticated: !!ndcBookingApi.getAuthToken(),
    
    // Auth actions
    login: ndcBookingApi.login,
    register: ndcBookingApi.register,
    logout: () => {
      ndcBookingApi.logout();
      resetBooking();
    },
    
    // Booking actions
    searchFlights,
    selectFlight,
    selectBundle,
    startBooking,
    addPassengers,
    setExtras,
    proceedToPayment,
    holdFlight,
    processPayment,
    confirmBooking,
    issueTicket,
    completeBookingAfterPayment,
    getBookingDetails,
    resetBooking,
    
    // UI actions
    setStep,
    setLoading,
    setError,
    clearError,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

// ========================================
// HOOK
// ========================================

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

export default BookingContext;
