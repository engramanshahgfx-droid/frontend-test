"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useParams } from "next/navigation";
import { useUI } from "../providers/UIProvider";
import { useAuth } from "../providers/AuthProvider";
import { bookingsAPI, paymentsAPI, API_URL } from "../lib/api";

const defaultTrip = { title: "Trip", slug: "", amount: 0 };

export default function BookingModal() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang;
  const isRTL = lang === "ar";

  const { bookingModal, closeBookingModal, openAuthModal, setBookingModal } = useUI();
  const { user, isAuthenticated } = useAuth();

  // Use the trip data passed from the clicked offer
  const trip = useMemo(() => {
    return { ...defaultTrip, ...(bookingModal.trip || {}) };
  }, [bookingModal.trip]);

  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);
  // Initialize date with tomorrow's date (not today, as per validation 'after_or_equal:yesterday')
  const getDefaultDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };
  const [form, setForm] = useState({
    date: getDefaultDate(),
    guests: 1,
    notes: "",
    name: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [mounted, setMounted] = useState(false);

  // Trips list & selection (allow choosing a different trip inside the modal)
  const [tripsList, setTripsList] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(trip);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    // When bookingModal.trip changes (user clicked a new item), always sync selectedTrip
    // This ensures the clicked destination/trip is shown, not something from the dropdown
    if (trip && (trip.title || trip.slug || trip.amount)) {
      console.debug('[BookingModal] Syncing selectedTrip from bookingModal.trip:', trip);
      setSelectedTrip(trip);
    }
  }, [trip]);


  // Calculate total price based on number of guests
  // Price parsing helper (handles strings like 'From 799 SAR per person')
  const parsePrice = (v) => {
    if (v === null || v === undefined) return 0;
    const n = parseFloat(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const basePrice = useMemo(() => {
    const current = selectedTrip || trip;
    return parsePrice(current.amount) || parsePrice(current.price) || parsePrice(current.price_en) || parsePrice(current.price_ar) || 0;
  }, [selectedTrip, trip]);

  const totalAmount = useMemo(() => {
    const guestCount = Number(form.guests) || 1;
    return basePrice * guestCount;
  }, [basePrice, form.guests]);

  const t = useMemo(
    () => ({
      title: isRTL ? `حجز ${selectedTrip.title || trip.title || "رحلة"}` : `Book ${selectedTrip.title || trip.title || "Trip"}`,
      steps: [
        isRTL ? "تفاصيل الرحلة" : "Trip Details",
        isRTL ? "بيانات المستخدم" : "User Info",
        isRTL ? "مراجعة" : "Review",
        isRTL ? "الدفع" : "Payment",
      ],
      trip: isRTL ? "الرحلة" : "Trip",
      date: isRTL ? "التاريخ" : "Date",
      guests: isRTL ? "عدد الأشخاص" : "Persons",
      notes: isRTL ? "ملاحظات" : "Notes",
      name: isRTL ? "الاسم" : "Name",
      email: isRTL ? "البريد الإلكتروني" : "Email",
      phone: isRTL ? "الجوال" : "Phone",
      review: isRTL ? "مراجعة" : "Review",
      total: isRTL ? "الإجمالي" : "Total",
      payment: isRTL ? "الدفع" : "Payment",
      redirect: isRTL ? "سيتم تحويلك لصفحة الدفع الآمنة." : "We will redirect you to the secure payment page.",
      payConfirm: isRTL ? "ادفع وأكّد" : "Pay & Confirm",
      continue: isRTL ? "متابعة" : "Continue",
      back: isRTL ? "رجوع" : "Back",
      personsPlaceholder: isRTL ? "أدخل عدد الأشخاص" : "Enter number of persons",
      notesPlaceholder: isRTL ? "أدخل ملاحظاتك" : "Add any notes",
      processing: isRTL ? "جاري المعالجة..." : "Processing...",
    }),
    [isRTL, trip.title]
  );

  const canContinue = useMemo(() => {
    if (step === 1) {
      const hasValidDate = Boolean(form.date) && !blockedDates.includes(form.date);
      const hasValidGuests = Number(form.guests) > 0;
      return hasValidDate && hasValidGuests;
    }
    if (step === 2) return Boolean(form.name) && Boolean(form.email);
    return true;
  }, [step, form, blockedDates]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name || "", email: user.email || "", phone: user.phone || "" }));
    }
  }, [user]);

  useEffect(() => {
    if (!bookingModal.open) {
      setStep(1);
      setBookingId(null);
      setStatus({ state: "idle", message: "" });
      setPaymentMethod("credit_card");
    }
  }, [bookingModal.open]);

  // If modal opens while user is unauthenticated, redirect to login
  useEffect(() => {
    if (bookingModal.open && !isAuthenticated) {
      closeBookingModal();
      openAuthModal("login");
      return;
    }

    // When modal opens, optionally fetch trips list so user can change selection
    const loadTripsAndLatestData = async () => {
      if (!bookingModal.open) return;

      const base = API_URL.replace(/\/$/, "");

      // Fetch from BOTH trips AND island-destinations to get all bookable items
      try {
        // Fetch trips
        const tripsPromise = fetch(`${base}/trips?per_page=200`).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] }));
        
        // Fetch local island destinations (this is where IslandDestinationslocal data comes from)
        const islandsPromise = fetch(`${base}/island-destinations/local`).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] }));
        
        const [tripsJson, islandsJson] = await Promise.all([tripsPromise, islandsPromise]);
        
        const tripsList = Array.isArray(tripsJson.data) ? tripsJson.data : (Array.isArray(tripsJson) ? tripsJson : []);
        const islandsList = Array.isArray(islandsJson.data) ? islandsJson.data : [];
        
        // Normalize island destinations to have same structure as trips
        const normalizedIslands = islandsList.map(island => ({
          ...island,
          title: island.title_en || island.title_ar || island.title || island.name || '',
          name: island.name || island.title_en || island.title || '',
          slug: island.slug || String(island.id) || '',
          amount: island.price || island.price_en || island.amount || 0,
          price: island.price || island.price_en || island.amount || 0,
          _source: 'island-destination', // Mark source for debugging
        }));
        
        // Normalize trips
        const normalizedTrips = tripsList.map(trip => ({
          ...trip,
          title: trip.title || trip.name || '',
          name: trip.name || trip.title || '',
          slug: trip.slug || String(trip.id) || '',
          amount: trip.amount || trip.price || trip.price_en || 0,
          price: trip.price || trip.amount || 0,
          _source: 'trip',
        }));
        
        // Only show local island destinations in the dropdown (these are the "local" trips seeded)
        // This ensures the modal shows only local trips (e.g. the three AlUla trips) and excludes other generic trips.
        const allItems = normalizedIslands; // don't include normalizedTrips here
        console.debug('[BookingModal] Loaded local island items only:', { islands: normalizedIslands.length, tripsChecked: normalizedTrips.length, total: allItems.length });
        
        setTripsList(allItems);

        // If the modal was opened with a trip, ensure it's in the list for matching
        // Also pre-select the initial trip by matching slug or title
        const initialSlug = bookingModal.trip?.slug;
        const initialTitle = bookingModal.trip?.title;
        const initialAmount = bookingModal.trip?.amount;
        
        console.debug('[BookingModal] Looking for initial trip:', { initialSlug, initialTitle, initialAmount });
        
        if (initialSlug || initialTitle) {
          const matched = allItems.find(t => 
            (initialSlug && (String(t.slug) === String(initialSlug) || String(t.id) === String(initialSlug))) ||
            (initialTitle && (t.title === initialTitle || t.name === initialTitle))
          );
          
          if (matched) {
            console.debug('[BookingModal] Found matching item:', matched);
            const matchedTrip = {
              ...matched,
              title: matched.title || matched.name || '',
              slug: matched.slug || String(matched.id) || '',
              amount: matched.amount || matched.price || matched.price_en || 0
            };
            setSelectedTrip(matchedTrip);
          } else {
            // If no match found, use the passed trip data directly (user clicked from slider)
            console.debug('[BookingModal] No match found, using passed trip data directly');
            if (initialTitle && initialAmount) {
              setSelectedTrip({
                title: initialTitle,
                slug: initialSlug || '',
                amount: initialAmount,
              });
            }
          }
        }
      } catch (err) {
        console.warn('[BookingModal] failed to fetch trips list', err);
      }

      // Fetch blocked dates for the selected trip
      const tripSlug = bookingModal.trip?.slug;
      if (tripSlug) {
        try {
          const blockedRes = await fetch(`${base}/trips/${encodeURIComponent(tripSlug)}/blocked-dates`);
          if (blockedRes.ok) {
            const blockedJson = await blockedRes.json();
            const dates = blockedJson.data || blockedJson.blocked_dates || blockedJson;
            setBlockedDates(Array.isArray(dates) ? dates : []);
          }
        } catch (err) {
          console.warn('[BookingModal] failed to fetch blocked dates', err);
        }
      }

      const slug = bookingModal.trip?.slug;
      if (!slug) return;

      try {
        let price = 0;

        // Try direct endpoint by slug/id
        try {
          const res = await fetch(`${base}/island-destinations/${encodeURIComponent(slug)}`);
          if (res.ok) {
            const json = await res.json();
            const data = json.data || json;
            price = parseFloat(data?.price) || parseFloat(data?.price_en) || parseFloat(data?.amount) || 0;
          } else {
            // Fallback: query list endpoint with slug filter
            const fallbackRes = await fetch(`${base}/island-destinations?slug=${encodeURIComponent(slug)}`);
            if (fallbackRes.ok) {
              const listJson = await fallbackRes.json();
              const list = listJson.data || listJson;
              const dest = Array.isArray(list) ? list.find(i => String(i.slug) === String(slug)) : list;
              if (dest) price = parseFloat(dest.price) || parseFloat(dest.price_en) || parseFloat(dest.amount) || 0;
            }
          }
        } catch (err) {
          console.warn('Failed to fetch island destination by slug, trying list endpoint', err);
          const listRes2 = await fetch(`${API_URL.replace(/\/$/, '')}/island-destinations`);
          if (listRes2.ok) {
            const listJson = await listRes2.json();
            const list = listJson.data || listJson;
            const dest = Array.isArray(list) ? list.find(i => String(i.slug) === String(slug)) : list;
            if (dest) price = parseFloat(dest.price) || parseFloat(dest.price_en) || parseFloat(dest.amount) || 0;
          }
        }

        // Update shared booking state with authoritative price if it differs
        if (typeof price === 'number' && price > 0) {
          console.debug('[BookingModal] updating booking trip amount from backend ->', { slug, price });
          setBookingModal((s) => ({ ...s, trip: { ...s.trip, amount: price } }));
        }
      } catch (err) {
        console.warn('[BookingModal] could not fetch latest trip data', err);
      }
    };

    loadTripsAndLatestData();
  }, [bookingModal.open, isAuthenticated, closeBookingModal, openAuthModal, setBookingModal]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (bookingModal.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [bookingModal.open]);

  const disabled = status.state === "loading";

  const next = () => {
    if (!canContinue) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    const currentTrip = selectedTrip || trip;

    const payload = {
      trip_slug: currentTrip.slug,
      date: form.date,
      guests: Number(form.guests),
      details: {
        notes: form.notes,
        trip_title: currentTrip.title || currentTrip.name || '',
        price_per_person: basePrice,
        total_amount: totalAmount,
        user_phone: form.phone,
      },
      amount: totalAmount,
      payment_method: paymentMethod,
    };

    setStatus({ state: "loading", message: "Processing booking..." });

    try {
      let id = bookingId;
      if (!id) {
        const res = await bookingsAPI.create(payload);
        id = res?.booking?.id || res?.id;
        setBookingId(id);
      }

      setStatus({ state: "loading", message: "Redirecting to payment..." });
      const gateway = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || "moyasar";
      
      const payRes = await paymentsAPI.initiate({
        booking_id: id,
        amount: totalAmount,
        method: paymentMethod,
        gateway: gateway,
      });

      // For Moyasar and embedded payment forms, redirect to our payment page
      if (gateway === 'moyasar' || payRes.moyasar_config) {
        closeBookingModal();
        router.push(`/${lang || 'ar'}/payment?booking_id=${id}`);
        return;
      }

      // For external payment gateways with redirect URL
      if (payRes.payment_url) {
        window.location.href = payRes.payment_url;
        return;
      }

      setStatus({ state: "success", message: isRTL ? "تم الحجز بنجاح!" : "Booking confirmed!" });
      setTimeout(() => {
        closeBookingModal();
        const target = `${lang ? `/${lang}` : ""}/dashboard?tab=bookings`;
        router.push(target);
        router.refresh?.();
      }, 1500);
    } catch (err) {
      setStatus({ state: "error", message: err?.message || (isRTL ? "حدث خطأ" : "Something went wrong") });
    }
  };

  if (!mounted || !bookingModal.open || !isAuthenticated) return null;

  // Styles
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
    padding: "1rem",
  };

  const shellStyle = {
    background: "#fff",
    width: "100%",
    maxWidth: "700px",
    borderRadius: "14px",
    position: "relative",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
    overflow: "hidden",
    direction: isRTL ? "rtl" : "ltr",
  };

  const closeStyle = {
    position: "absolute",
    top: "12px",
    right: isRTL ? "auto" : "12px",
    left: isRTL ? "12px" : "auto",
    border: "none",
    background: "none",
    fontSize: "28px",
    color: "#666",
    cursor: "pointer",
    zIndex: 10,
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  };

  const headerStyle = {
    padding: "1.25rem 1.5rem 0.75rem",
    borderBottom: "1px solid #eee",
  };

  const stepsStyle = {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
  };

  const stepStyle = (isActive) => ({
    padding: "0.4rem 0.75rem",
    borderRadius: "999px",
    background: isActive ? "#e0ecff" : "#f1f3f5",
    color: isActive ? "#0b63f6" : "#555",
    fontSize: "0.85rem",
    fontWeight: isActive ? 700 : 400,
  });

  const bodyStyle = {
    padding: "1.25rem 1.5rem",
    display: "grid",
    gap: "1rem",
    overflowY: "auto",
    flex: 1,
  };

  const panelStyle = {
    background: "#f9fafb",
    border: "1px solid #eef1f4",
    borderRadius: "12px",
    padding: "1rem",
    display: "grid",
    gap: "0.75rem",
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#222",
    fontSize: "0.95rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "1px solid #d9dde3",
    fontSize: "1rem",
    fontFamily: '"Tajawal", sans-serif',
    boxSizing: "border-box",
    textAlign: isRTL ? "right" : "left",
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    minHeight: "80px",
  };

  const reviewStyle = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "0.5rem",
  };

  const reviewItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    color: "#333",
    background: "#fff",
    padding: "0.65rem 0.75rem",
    borderRadius: "10px",
    border: "1px solid #eef1f4",
  };

  const paymentGridStyle = {
    display: "grid",
    gap: "0.5rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  };

  const paymentOptionStyle = (isActive, isDisabled) => ({
    border: `1px solid ${isActive ? "#0b63f6" : "#d9dde3"}`,
    borderRadius: "10px",
    padding: "0.85rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    cursor: isDisabled ? "not-allowed" : "pointer",
    background: isActive ? "#eaf2ff" : "#fff",
    opacity: isDisabled ? 0.5 : 1,
  });

  const alertStyle = (type) => ({
    margin: "0 1.5rem 0.75rem",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid",
    background: type === "error" ? "#fdecea" : "#e6f4ea",
    borderColor: type === "error" ? "#f5c2c7" : "#b7e0c2",
    color: type === "error" ? "#b91c1c" : "#166534",
  });

  const footerStyle = {
    padding: "1rem 1.5rem 1.25rem",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  };

  const primaryBtnStyle = {
    background: "#0b63f6",
    color: "#fff",
    border: "none",
    padding: "0.85rem 1.2rem",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled || !canContinue ? 0.6 : 1,
    fontSize: "1rem",
  };

  const ghostBtnStyle = {
    background: "#fff",
    color: "#0b63f6",
    border: "1px solid #0b63f6",
    padding: "0.85rem 1.2rem",
    borderRadius: "10px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    fontSize: "1rem",
  };

  const modal = (
    <div style={overlayStyle} onClick={closeBookingModal}>
      <div style={shellStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeStyle} onClick={closeBookingModal} aria-label="Close">
          ×
        </button>

        <header style={headerStyle}>
          <div style={stepsStyle}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={stepStyle(step >= s)}>
                {t.steps[s - 1]}
              </div>
            ))}
          </div>
          <h3 style={{ margin: 0, color: "#111" }}>{t.title}</h3>
        </header>

        <section style={bodyStyle}>
          {step === 1 && (
            <div style={panelStyle}>
              <h4 style={{ margin: 0 }}>{t.steps[0]}</h4>
              <label style={labelStyle}>{t.trip}</label>

              {/* If we fetched a trips list, allow the user to select a trip; otherwise show the passed trip */}
              {tripsList && tripsList.length > 0 ? (
                <select
                  style={{ ...inputStyle, appearance: 'none' }}
                  value={selectedTrip?.slug || selectedTrip?.title || ''}
                  onChange={async (e) => {
                    const selectedValue = e.target.value;
                    // Find by slug first, then by title (for items without slug)
                    const found = tripsList.find(t => 
                      String(t.slug) === String(selectedValue) || 
                      String(t.title) === String(selectedValue)
                    );
                    if (found) {
                      setSelectedTrip(found);
                      // Update global booking state so other parts of the app can use it
                      setBookingModal(s => ({ ...s, trip: { ...s.trip, title: found.title || found.name || '', slug: found.slug || '', amount: found.amount || found.price || found.price_en || 0 } }));
                      
                      // Fetch blocked dates for the newly selected trip
                      try {
                        const base = API_URL.replace(/\/$/, "");
                        const blockedRes = await fetch(`${base}/trips/${encodeURIComponent(found.slug)}/blocked-dates`);
                        if (blockedRes.ok) {
                          const blockedJson = await blockedRes.json();
                          const dates = blockedJson.data || blockedJson.blocked_dates || blockedJson;
                          setBlockedDates(Array.isArray(dates) ? dates : []);
                        } else {
                          setBlockedDates([]);
                        }
                      } catch (err) {
                        console.warn('[BookingModal] failed to fetch blocked dates for trip', found.slug, err);
                        setBlockedDates([]);
                      }
                      
                      // Clear any blocked date error if date was previously selected
                      if (form.date) {
                        setStatus({ state: 'idle', message: '' });
                      }
                    }
                  }}
                >
                  {/* Add the currently selected trip as first option if it's not in the list */}
                  {selectedTrip && selectedTrip.title && !tripsList.find(t => 
                    String(t.slug) === String(selectedTrip.slug) || 
                    String(t.title) === String(selectedTrip.title)
                  ) && (
                    <option value={selectedTrip.slug || selectedTrip.title}>
                      {selectedTrip.title} {selectedTrip.amount ? `- ${selectedTrip.amount} SAR` : ''}
                    </option>
                  )}
                  <option value="">{isRTL ? 'اختر رحلة أخرى' : 'Select a different trip'}</option>
                  {tripsList.map((t) => (
                    <option key={t.slug || t.id || t.title} value={t.slug || t.title}>
                      {t.title || t.name || t.slug} {t.price || t.amount ? `- ${t.price || t.amount} SAR` : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ 
                  ...inputStyle, 
                  background: "#f8f9fa", 
                  border: "2px solid #0b63f6",
                  fontWeight: 600,
                  color: "#333"
                }}>
                  {selectedTrip?.title || trip.title || (isRTL ? 'لم يتم اختيار رحلة' : 'No trip selected')}
                </div>
              )}
              
              {/* Show selected trip price if available */}
              {basePrice > 0 && (
                <div style={{ 
                  background: '#e8f5e9', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  marginTop: '0.5rem',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ color: '#2e7d32', fontWeight: 600 }}>
                      {isRTL ? 'السعر للشخص:' : 'Price per person:'}
                    </span>
                    <strong style={{ color: '#2e7d32', fontSize: '1rem' }}>
                      {basePrice} SAR
                    </strong>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #c8e6c9',
                    paddingTop: '0.5rem'
                  }}>
                    <span style={{ color: '#1b5e20', fontWeight: 700 }}>
                      {isRTL ? `الإجمالي (${form.guests} ${Number(form.guests) === 1 ? 'شخص' : 'أشخاص'}):` : `Total (${form.guests} ${Number(form.guests) === 1 ? 'person' : 'persons'}):`}
                    </span>
                    <strong style={{ color: '#1b5e20', fontSize: '1.2rem' }}>
                      {totalAmount} SAR
                    </strong>
                  </div>
                </div>
              )}
              
              <label style={labelStyle}>{t.date}</label>
              <input
                style={{
                  ...inputStyle,
                  ...(blockedDates.includes(form.date) ? { borderColor: '#dc3545', backgroundColor: '#fff5f5' } : {})
                }}
                type="date"
                value={form.date}
                onChange={(e) => {
                  const selectedDate = e.target.value;
                  if (blockedDates.includes(selectedDate)) {
                    // Show warning but allow selection (we'll block on submit)
                    setStatus({ 
                      state: 'error', 
                      message: isRTL 
                        ? 'هذا التاريخ غير متاح للحجز. يرجى اختيار تاريخ آخر.' 
                        : 'This date is not available for booking. Please select another date.' 
                    });
                  } else {
                    setStatus({ state: 'idle', message: '' });
                  }
                  setForm({ ...form, date: selectedDate });
                }}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              {blockedDates.length > 0 && (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                  {isRTL 
                    ? `التواريخ غير المتاحة: ${blockedDates.slice(0, 5).join(', ')}${blockedDates.length > 5 ? '...' : ''}`
                    : `Unavailable dates: ${blockedDates.slice(0, 5).join(', ')}${blockedDates.length > 5 ? '...' : ''}`
                  }
                </p>
              )}
              <label style={labelStyle}>{t.guests}</label>
              <input
                style={inputStyle}
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                placeholder={t.personsPlaceholder}
              />
              <label style={labelStyle}>{t.notes}</label>
              <textarea
                style={textareaStyle}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder={t.notesPlaceholder}
              />
            </div>
          )}

          {step === 2 && (
            <div style={panelStyle}>
              <h4 style={{ margin: 0 }}>{t.steps[1]}</h4>
              <label style={labelStyle}>{t.name}</label>
              <input
                style={inputStyle}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <label style={labelStyle}>{t.email}</label>
              <input
                style={inputStyle}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label style={labelStyle}>{t.phone}</label>
              <input
                style={inputStyle}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          )}

          {step === 3 && (
            <div style={panelStyle}>
              <h4 style={{ margin: 0 }}>{t.review}</h4>
              <ul style={reviewStyle}>
                <li style={reviewItemStyle}>
                  <span>{t.trip}</span>
                  <strong>{selectedTrip?.title || trip.title}</strong>
                </li>
                <li style={reviewItemStyle}>
                  <span>{t.date}</span>
                  <strong>{form.date || "-"}</strong>
                </li>
                <li style={reviewItemStyle}>
                  <span>{t.guests}</span>
                  <strong>{form.guests}</strong>
                </li>
                {basePrice > 0 && (
                  <li style={reviewItemStyle}>
                    <span>{isRTL ? 'السعر للشخص' : 'Price per person'}</span>
                    <strong>{basePrice} SAR</strong>
                  </li>
                )}
                <li style={{ ...reviewItemStyle, background: '#e8f5e9', border: '2px solid #4caf50' }}>
                  <span style={{ fontWeight: 700 }}>{t.total}</span>
                  <strong style={{ color: '#1b5e20', fontSize: '1.1rem' }}>{totalAmount} SAR</strong>
                </li>
              </ul>
            </div>
          )}

          {step === 4 && (
            <div style={panelStyle}>
              <h4 style={{ margin: 0 }}>{t.payment}</h4>
              {/* Simplified payment step: no manual method selection. User will be redirected to the payment gateway. */}
              <p style={{ color: "#666", margin: "0.25rem 0 0", fontSize: "0.9rem" }}>{isRTL ? 'سيتم توجيهك إلى بوابة الدفع لإتمام العملية' : 'You will be redirected to the payment gateway to complete your payment.'}</p>
            </div>
          )}
        </section>

        {status.state === "error" && <div style={alertStyle("error")}>{status.message}</div>}
        {status.state === "success" && <div style={alertStyle("success")}>{status.message}</div>}

        <footer style={footerStyle}>
          <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
            {t.total}: {totalAmount} SAR
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {step > 1 && (
              <button style={ghostBtnStyle} onClick={back} disabled={disabled}>
                {t.back}
              </button>
            )}
            {step < 4 && (
              <button style={primaryBtnStyle} onClick={next} disabled={disabled || !canContinue}>
                {t.continue}
              </button>
            )}
            {step === 4 && (
              <button style={primaryBtnStyle} onClick={handleSubmit} disabled={disabled}>
                {status.state === "loading" ? t.processing : t.payConfirm}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
