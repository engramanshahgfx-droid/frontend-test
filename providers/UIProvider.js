"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

const UIContext = createContext();

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
};

export default function UIProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });
  const [bookingModal, setBookingModal] = useState({
    open: false,
    trip: null, // { slug, title, amount }
  });
  const [reservationModal, setReservationModal] = useState({
    open: false,
    trip: null, // { slug, title, type }
  });
  const [pendingTrip, setPendingTrip] = useState(null);
  // Dashboard refresh key to let components request a reload of dashboard data
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);
  const triggerDashboardRefresh = React.useCallback(() => setDashboardRefreshKey(k => k + 1), []);

  // Stable modal helpers to avoid changing references across renders
  const openAuthModal = React.useCallback((mode = "login") => {
    setAuthModal({ open: true, mode });
  }, []);

  const closeAuthModal = React.useCallback(() => {
    setAuthModal((s) => ({ ...s, open: false }));
  }, []);

  // ============================================
  // BOOKING MODAL (Requires Authentication)
  // ============================================
  const openBookingModal = React.useCallback((trip = {}) => {
    setPendingTrip(null);
    setBookingModal({ open: true, trip });
  }, []);

  const closeBookingModal = React.useCallback(() => {
    setBookingModal({ open: false, trip: null });
  }, []);

  const openBookingOrAuth = React.useCallback((trip = {}) => {
    if (isAuthenticated) {
      openBookingModal(trip);
    } else {
      setPendingTrip(trip);
      setAuthModal({ open: true, mode: "login" });
      setBookingModal({ open: false, trip: null });
    }
  }, [isAuthenticated, openBookingModal]);

  // ============================================
  // RESERVATION MODAL (No Authentication Required)
  // ============================================
  const openReservationModal = React.useCallback((trip = {}) => {
    setReservationModal({ open: true, trip });
  }, []);

  const closeReservationModal = React.useCallback(() => {
    setReservationModal({ open: false, trip: null });
  }, []);

  const handleAuthSuccess = React.useCallback(() => {
    closeAuthModal();
    if (pendingTrip) {
      openBookingModal(pendingTrip);
    }
    setPendingTrip(null);
  }, [pendingTrip, closeAuthModal, openBookingModal]);
  const value = useMemo(
    () => ({
      authModal,
      bookingModal,
      reservationModal,
      pendingTrip,
      // Dashboard refresh helpers
      dashboardRefreshKey,
      triggerDashboardRefresh,
      openAuthModal,
      closeAuthModal,
      openBookingModal,
      closeBookingModal,
      openBookingOrAuth,
      openReservationModal,
      closeReservationModal,
      handleAuthSuccess,
      setAuthModal,
      setBookingModal,
      setReservationModal,
    }),
    [authModal, bookingModal, reservationModal, isAuthenticated, pendingTrip, dashboardRefreshKey]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}