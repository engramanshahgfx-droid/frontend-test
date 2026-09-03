"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  FaPlane, FaSearch, FaCalendarAlt, FaUser, FaExchangeAlt, 
  FaChevronDown, FaMinus, FaPlus, FaSuitcase, FaCheckCircle, FaTimes,
  FaMobileAlt, FaTrain, FaSwimmer, FaTicketAlt, FaKaaba, FaGlobe, FaWhatsapp, FaEllipsisH,
  FaRegStar, FaStar
} from "react-icons/fa";

import ALL_AIRPORTS from "@/lib/akbarAirports";
import akbarApi from "@/lib/akbarApi";

export default function AkbarFlights() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "en";
  const isRTL = lang === "ar";

  const [tripType, setTripType] = useState("oneway");
  const [directOnly, setDirectOnly] = useState(false);
  const [includedBaggage, setIncludedBaggage] = useState(false);

  const [origin, setOrigin] = useState("JED");
  const [originCity, setOriginCity] = useState("Jeddah, Saudi Arabia");
  const [originAirportName, setOriginAirportName] = useState("King Abdulaziz International Airport");

  const [destination, setDestination] = useState("CAI");
  const [destinationCity, setDestinationCity] = useState("Cairo, Egypt");
  const [destAirportName, setDestAirportName] = useState("Cairo International Airport");

  const [departDate, setDepartDate] = useState("2026-09-02");
  const [returnDate, setReturnDate] = useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("economy");

  const [showPaxModal, setShowPaxModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'origin' | 'dest' | null
  const [searchQuery, setSearchQuery] = useState("");
  const [backendAirports, setBackendAirports] = useState([]);

  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const totalPassengers = adults + children + infants;

  useEffect(() => {
    if (!searchQuery.trim()) {
      setBackendAirports([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await akbarApi.getAirports(searchQuery);
        if (res.ok && res.data?.data) {
          setBackendAirports(res.data.data);
        }
      } catch (err) {
        console.error('Failed fetching backend airports:', err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
  };

  const handleSwap = () => {
    const tmpCode = origin;
    const tmpCity = originCity;
    const tmpName = originAirportName;

    setOrigin(destination);
    setOriginCity(destinationCity);
    setOriginAirportName(destAirportName);

    setDestination(tmpCode);
    setDestinationCity(tmpCity);
    setDestAirportName(tmpName);
  };

  const filteredAirports = backendAirports.length > 0
    ? backendAirports
    : ALL_AIRPORTS.filter((ap) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          ap.Code.toLowerCase().includes(q) ||
          ap.CityName.toLowerCase().includes(q) ||
          ap.Country.toLowerCase().includes(q) ||
          ap.Name.toLowerCase().includes(q) ||
          (ap.Alias && ap.Alias.toLowerCase().includes(q))
        );
      });

  const selectAirport = (ap, type) => {
    if (type === "origin") {
      setOrigin(ap.Code);
      setOriginCity(`${ap.CityName}, ${ap.Country}`);
      setOriginAirportName(ap.Name);
    } else {
      setDestination(ap.Code);
      setDestinationCity(`${ap.CityName}, ${ap.Country}`);
      setDestAirportName(ap.Name);
    }
    setActiveDropdown(null);
    setSearchQuery("");
  };

  const formatTimeStr = (str) => {
    if (!str) return "06:05";
    if (typeof str === "string" && str.includes("T")) {
      const timePart = str.split("T")[1]?.substring(0, 5);
      if (timePart) return timePart;
    }
    return str;
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const searchPayload = {
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departure_date: departDate,
        return_date: returnDate || null,
        adults,
        children,
        infants,
        cabin_class: cabinClass,
        direct_only: directOnly,
      };

      const response = await fetch(`${API_BASE}/v2/akbar/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Accept-Language": lang || "en"
        },
        body: JSON.stringify(searchPayload),
      });

      const data = await response.json();
      const rawOffers = data?.data?.offers || data?.offers || [];
      
      const normalizedOffers = rawOffers.map(offer => ({
        offerId: offer.supplier_offer_id || offer.offer_id || offer.OfferID || offer.offerId,
        airline: offer.airline || offer.airline_code || offer.Airline || 'Flyadeal',
        airlineCode: offer.airline_code || offer.AirlineCode || offer.airlineCode || 'F3',
        flightNumber: offer.flight_number || offer.FlightNumber || offer.flightNumber || 'F3-158',
        departureTime: formatTimeStr(offer.departure_time || offer.DepartureTime || offer.departureTime || '06:05'),
        arrivalTime: formatTimeStr(offer.arrival_time || offer.ArrivalTime || offer.arrivalTime || '08:55'),
        departure: offer.origin || offer.Origin || origin?.toUpperCase(),
        arrival: offer.destination || offer.Destination || destination?.toUpperCase(),
        duration: offer.duration || offer.Duration || '01h 35m',
        stops: offer.stops !== undefined ? offer.stops : 0,
        price: typeof offer.price === 'object' ? (offer.price?.total || 272.2) : (offer.Price?.Total || offer.price || 272.2),
        currency: typeof offer.price === 'object' ? (offer.price?.currency || 'SAR') : (offer.Currency || 'SAR'),
        cabin: offer.cabin_class_label || offer.CabinClass || 'Economy',
        checkedBaggage: offer.checked_baggage || offer.Baggage || '20 KG Checked Baggage',
        cabinBaggage: offer.cabin_baggage || '07 KG Cabin Baggage',
        raw: offer
      }));

      setOffers(normalizedOffers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectOffer = (offer) => {
    const isRoundTrip = tripType === 'roundtrip' && !!returnDate;
    const stored = {
      offerId: offer.offerId,
      airline: offer.airline,
      airlineCode: offer.airlineCode,
      flightNo: offer.flightNumber,
      origin: offer.departure,
      destination: offer.arrival,
      departureDate: departDate,
      returnDate: returnDate || null,
      isRoundTrip: isRoundTrip,
      depTime: offer.departureTime,
      arrTime: offer.arrivalTime,
      duration: offer.duration,
      price: offer.price,
      currency: offer.currency,
      legs: [
        {
          from: offer.departure,
          to: offer.arrival,
          airline: offer.airline,
          flightNo: offer.flightNumber,
          date: departDate,
          dep: offer.departureTime,
          arr: offer.arrivalTime,
          duration: offer.duration,
          isDirect: true
        },
        ...(isRoundTrip ? [{
          from: offer.arrival,
          to: offer.departure,
          airline: offer.airline,
          flightNo: offer.flightNumber,
          date: returnDate,
          dep: offer.departureTime,
          arr: offer.arrivalTime,
          duration: offer.duration,
          isDirect: true
        }] : [])
      ],
      raw: offer
    };

    localStorage.setItem('selectedFlight', JSON.stringify(stored));
    router.push(`/${lang}/akbar-flights/booking`);
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* ── Dynamic Hero Backdrop (Almosafer Style) ── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
        backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: 140,
        paddingBottom: 70,
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        marginTop: 0
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.45)' }} />

        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
          
          {/* Almosafer Hero Headline */}
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <h1 style={{ color: '#ffffff', fontSize: '2.4rem', fontWeight: 800, margin: '0 0 6px 0', textShadow: '0 2px 10px rgba(0,0,0,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
              The entire world awaits you!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.05rem', fontWeight: 500, margin: 0 }}>
              Fly anywhere with over 450 of your favorite airlines
            </p>
          </div>

          {/* ── Main White Search Widget Container ── */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: '24px 28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}>

            {/* ── Top Bar: Trip Type Pills & Checkboxes ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              
              {/* Trip Type Radio Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setTripType('oneway')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: tripType === 'oneway' ? '#e0f2fe' : '#f1f5f9',
                    color: tripType === 'oneway' ? '#0284c7' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('roundtrip')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: tripType === 'roundtrip' ? '#e0f2fe' : '#f1f5f9',
                    color: tripType === 'roundtrip' ? '#0284c7' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('multicity')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 24,
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: tripType === 'multicity' ? '#e0f2fe' : '#f1f5f9',
                    color: tripType === 'multicity' ? '#0284c7' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  Multi City
                </button>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={directOnly}
                    onChange={(e) => setDirectOnly(e.target.checked)}
                    style={{ accentColor: '#0284c7', width: 16, height: 16, cursor: 'pointer' }}
                  />
                  Direct Flights
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={includedBaggage}
                    onChange={(e) => setIncludedBaggage(e.target.checked)}
                    style={{ accentColor: '#0284c7', width: 16, height: 16, cursor: 'pointer' }}
                  />
                  Included Baggage
                </label>
              </div>
            </div>

            {/* ── Main Unified Search Bar Row ── */}
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'stretch', gap: 8, flexWrap: 'wrap' }} ref={dropdownRef}>
              
              {/* 1. Joined From / To Airport Selector Box */}
              <div style={{
                flex: '2 1 380px',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: '4px 10px',
                background: '#ffffff',
                position: 'relative'
              }}>
                
                {/* ── FROM FIELD ── */}
                <div 
                  onClick={() => { setActiveDropdown('origin'); setSearchQuery(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: activeDropdown === 'origin' ? '#f0f9ff' : 'transparent',
                    borderRadius: 8
                  }}
                >
                  <FaPlane style={{ color: '#94a3b8', transform: 'rotate(-45deg)', fontSize: 16 }} />
                  <div style={{ width: '100%', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>From</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {originCity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Swap Circle Button */}
                <button
                  type="button"
                  onClick={handleSwap}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    flexShrink: 0
                  }}
                >
                  <FaExchangeAlt style={{ fontSize: 12 }} />
                </button>

                {/* ── TO FIELD ── */}
                <div 
                  onClick={() => { setActiveDropdown('dest'); setSearchQuery(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: activeDropdown === 'dest' ? '#f0f9ff' : 'transparent',
                    borderRadius: 8
                  }}
                >
                  <FaPlane style={{ color: '#94a3b8', transform: 'rotate(45deg)', fontSize: 16 }} />
                  <div style={{ width: '100%', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>To</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {destinationCity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── LIVE AIRPORT SEARCH POPUP DROPDOWN (Akbar Travels / Almosafer Style) ── */}
                {activeDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '108%',
                    left: activeDropdown === 'origin' ? 0 : 'auto',
                    right: activeDropdown === 'dest' ? 0 : 'auto',
                    width: 380,
                    background: '#ffffff',
                    borderRadius: 14,
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
                    border: '1px solid #e2e8f0',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    {/* Search Input Box */}
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FaSearch style={{ color: '#94a3b8', fontSize: 14 }} />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search city, country or airport code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    {/* Section Header */}
                    <div style={{ padding: '10px 16px 6px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                      {searchQuery ? `Search Results (${filteredAirports.length})` : 'Top destinations'}
                    </div>

                    {/* Airport Options List */}
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {filteredAirports.length > 0 ? (
                        filteredAirports.map((ap) => (
                          <div
                            key={ap.Code}
                            onClick={() => selectAirport(ap, activeDropdown)}
                            style={{
                              padding: '10px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f8fafc',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <FaRegStar style={{ color: '#94a3b8', fontSize: 14, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                                  {ap.CityName}, {ap.Country}
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 1 }}>
                                  {ap.Name}
                                </div>
                              </div>
                            </div>
                            <span style={{
                              background: '#f1f5f9',
                              color: '#0f172a',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              padding: '4px 8px',
                              borderRadius: 6,
                              letterSpacing: '0.5px'
                            }}>
                              {ap.Code}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                          No airports found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Departure & Return Dates Box (Almosafer Style) */}
              <div style={{
                flex: '2 1 290px',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                background: '#ffffff',
                overflow: 'hidden'
              }}>
                {/* Departure Box */}
                <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', cursor: 'pointer' }}>
                  <FaCalendarAlt style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Departure</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                      {formatDateLabel(departDate)}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                  />
                </div>

                {/* Return Box */}
                <div style={{ flex: 1, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', cursor: 'pointer' }}>
                  {tripType === 'roundtrip' ? (
                    <>
                      <FaCalendarAlt style={{ color: '#0284c7', fontSize: 16, flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>Return</span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {formatDateLabel(returnDate || '2026-09-09')}
                        </span>
                      </div>
                      <input
                        type="date"
                        value={returnDate || '2026-09-09'}
                        onChange={(e) => setReturnDate(e.target.value)}
                        style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                      />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setTripType('roundtrip'); setReturnDate('2026-09-09'); }}
                      style={{ border: 'none', background: 'transparent', color: '#0284c7', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                    >
                      + Add return
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Passengers & Cabin Class Field */}
              <div 
                onClick={() => setShowPaxModal(!showPaxModal)}
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <FaUser style={{ color: '#94a3b8', fontSize: 14 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                  {totalPassengers} Traveler{totalPassengers > 1 ? 's' : ''}, {cabinClass.charAt(0).toUpperCase() + cabinClass.slice(1)}
                </span>
                <FaChevronDown style={{ color: '#94a3b8', fontSize: 10, marginLeft: 'auto' }} />

                {/* Pax Selector Dropdown Popup */}
                {showPaxModal && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      width: 280,
                      background: '#ffffff',
                      borderRadius: 12,
                      padding: 16,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      zIndex: 100
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Adults (12+ yrs)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}>-</button>
                        <span style={{ fontWeight: 700 }}>{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}>+</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Children (2-11 yrs)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}>-</button>
                        <span style={{ fontWeight: 700 }}>{children}</span>
                        <button type="button" onClick={() => setChildren(children + 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}>+</button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Infants (&lt; 2 yrs)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button type="button" onClick={() => setInfants(Math.max(0, infants - 1))} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}>-</button>
                        <span style={{ fontWeight: 700 }}>{infants}</span>
                        <button type="button" onClick={() => setInfants(infants + 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #cbd5e1', background: '#fff' }}>+</button>
                      </div>
                    </div>

                    <button type="button" onClick={() => setShowPaxModal(false)} style={{ width: '100%', padding: '8px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}>Apply</button>
                  </div>
                )}
              </div>

              {/* 4. Vibrant Search Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0 28px',
                  height: 48,
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(244, 63, 94, 0.4)',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <FaSearch style={{ fontSize: 16 }} />
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ── Almosafer Quick Services Bar ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '18px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {[
            { icon: <FaMobileAlt style={{ color: '#0284c7', fontSize: 18 }} />, label: 'eSIM', action: () => router.push(`/${lang}/services`) },
            { icon: <FaTrain style={{ color: '#00875a', fontSize: 18 }} />, label: 'Haramain', action: () => router.push(`/${lang}/services`) },
            { icon: <FaSwimmer style={{ color: '#06b6d4', fontSize: 18 }} />, label: 'Aquarabia', action: () => router.push(`/${lang}/tousimoffers`) },
            { icon: <FaTicketAlt style={{ color: '#e11d48', fontSize: 18 }} />, label: 'Six Flags', action: () => router.push(`/${lang}/tousimoffers`) },
            { icon: <FaKaaba style={{ color: '#d97706', fontSize: 18 }} />, label: 'Umrah', action: () => router.push(`/${lang}/tousimoffers`) },
            { icon: <FaGlobe style={{ color: '#2563eb', fontSize: 18 }} />, label: 'International packages', action: () => router.push(`/${lang}/tousimoffers`) },
            { icon: <FaWhatsapp style={{ color: '#25D366', fontSize: 20 }} />, label: 'WhatsApp Support', action: () => window.open('https://wa.me/966547305060', '_blank') },
            { icon: <FaEllipsisH style={{ color: '#64748b', fontSize: 18 }} />, label: 'More services', action: () => router.push(`/${lang}/services`) },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', textAlign: 'center' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Flight Results Cards ── */}
      <div style={{ maxWidth: 1180, margin: '40px auto 100px auto', padding: '0 20px 80px 20px' }}>
        {offers.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Available Flights ({offers.length})</h3>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Showing best value fares</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {offers.map((offer, idx) => (
                <div key={idx} style={{ background: '#ffffff', borderRadius: 16, padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#701a75', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                        {offer.airlineCode}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{offer.airline}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{offer.flightNumber}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{offer.departureTime}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{offer.departure}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{offer.duration}</div>
                        <div style={{ width: 60, height: 1, background: '#cbd5e1', position: 'relative', margin: '4px 0' }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#0284c7', position: 'absolute', right: 0, top: -1.5 }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#00875a', fontWeight: 700 }}>Direct</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{offer.arrivalTime}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{offer.arrival}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                      {offer.price} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{offer.currency}</span>
                    </div>
                    <button
                      onClick={() => selectOffer(offer)}
                      style={{
                        padding: '10px 24px',
                        background: '#f43f5e',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(244,63,94,0.3)'
                      }}
                    >
                      View Fare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
