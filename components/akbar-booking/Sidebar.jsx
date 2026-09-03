'use client';

import React, { useState } from 'react';

export default function Sidebar({ flight, step, passengerName, addInsurance, extras = [], passengerCount = 1 }) {
  const [showFlightDetailsModal, setShowFlightDetailsModal] = useState(false);
  const [showCancelDetailsModal, setShowCancelDetailsModal] = useState(false);

  if (!flight) return null;

  const baseFare = flight?.baseFare || flight?.price || 1159;
  const serviceFee = flight?.serviceFee || 124.59;
  const insurancePrice = flight?.insurancePrice || 43;

  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price || 0), 0);
  const flightTotal = baseFare;
  const addonsTotal = (addInsurance ? insurancePrice : 0) + extrasTotal;
  const grandTotal = flightTotal + serviceFee + addonsTotal;

  const leg = flight.legs?.[0] || {
    from: flight.origin || 'PEW',
    to: flight.destination || 'RUH',
    airline: flight.airline || 'Flyadeal',
    flightNo: flight.flightNo || 'F3-658',
    date: flight.departureDate || 'Wed, 02 Sep 2026',
    dep: flight.depTime || '06:35 AM',
    arr: flight.arrTime || '09:25 AM',
    duration: flight.duration || '04h 50m',
    isDirect: true
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 140 }}>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Flight summary</span>
          <button 
            onClick={() => setShowFlightDetailsModal(!showFlightDetailsModal)}
            style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', color: '#00875a', fontWeight: 600, cursor: 'pointer' }}
          >
            Details
          </button>
        </div>

        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, marginBottom: 2 }}>Departure</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>{leg.date}</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#701a75', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                {leg.airline?.[0] || 'F'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                {leg.airline} · {leg.flightNo}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00875a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 4 }}>
              {leg.isDirect ? 'Direct' : '1 Stop'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{leg.dep}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{leg.from}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: 2 }}>{leg.duration}</div>
              <div style={{ width: 40, height: 1, background: '#cbd5e1', position: 'relative' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00875a', position: 'absolute', right: 0, top: -1.5 }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{leg.arr}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{leg.to}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 18px', background: '#fafafa', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>Cancellation / Date Change</span>
          <button 
            onClick={() => setShowCancelDetailsModal(!showCancelDetailsModal)}
            style={{ border: 'none', background: 'transparent', fontSize: '0.75rem', color: '#00875a', fontWeight: 600, cursor: 'pointer' }}
          >
            Rules
          </button>
        </div>
      </div>

      {/* ── 2. Price Breakdown Card ── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Price breakdown</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem', color: '#475569' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Flights ({passengerCount} Pax)</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{flightTotal.toFixed(2)} SAR</span>
          </div>

          {serviceFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service Fee</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{serviceFee.toFixed(2)} SAR</span>
            </div>
          )}

          {addonsTotal > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Add-ons & Insurance</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{addonsTotal.toFixed(2)} SAR</span>
            </div>
          )}

          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 12, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Total (incl. VAT)</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00875a' }}>{grandTotal.toFixed(2)} <span style={{ fontSize: '0.75rem' }}>SAR</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
