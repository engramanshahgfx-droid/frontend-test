'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, X } from 'lucide-react';
import BookingModal from '../IslandDestinations/BookingModal';

/**
 * UnifiedBookingEntry Component
 * 
 * Serves as the main entry point for all bookings.
 * First asks user to choose: International Trip or Local Activities
 * Then opens the appropriate booking form
 */
export default function UnifiedBookingEntry({ isOpen, onClose, lang = 'en' }) {
  const [bookingType, setBookingType] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleClose = () => {
    setBookingType(null);
    setShowForm(false);
    onClose();
  };

  const handleTypeSelect = (type) => {
    setBookingType(type);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setBookingType(null);
    setShowForm(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Show selection screen if no type chosen, else show booking form */}
          {!showForm ? (
            <TypeSelectionModal 
              isOpen={isOpen}
              onClose={handleClose}
              onSelect={handleTypeSelect}
              lang={lang}
            />
          ) : (
            <BookingModal
              isOpen={true}
              onClose={handleBackToSelection}
              bookingLocation={bookingType}
              lang={lang}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * TypeSelectionModal Component
 * Shows user the choice between International Trip or Local Activities
 */
function TypeSelectionModal({ isOpen, onClose, onSelect, lang = 'en' }) {
  const isAr = lang === 'ar';

  const translations = {
    en: {
      title: 'How would you like to book?',
      subtitle: 'Choose the type of experience you\'re interested in',
      international: 'International Trip',
      internationalDesc: 'Book flights, hotels, complete packages and more',
      local: 'Local Activities',
      localDesc: 'Explore local attractions, entertainment and food',
      cancel: 'Cancel',
    },
    ar: {
      title: 'كيف تود الحجز؟',
      subtitle: 'اختر نوع التجربة التي تهمك',
      international: 'رحلة دولية',
      internationalDesc: 'احجز الرحلات والفنادق والحزم الكاملة والمزيد',
      local: 'أنشطة محلية',
      localDesc: 'استكشف الجاذبيات المحلية والترفيه والطعام',
      cancel: 'إلغاء',
    },
  };

  const t = translations[isAr ? 'ar' : 'en'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 ${
          isAr ? 'rtl' : 'ltr'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* International Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('international')}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-75" />
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-8 text-left hover:border-blue-400 transition-all cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-4">
                <Globe className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t.international}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.internationalDesc}
              </p>
            </div>
          </motion.button>

          {/* Local Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('local')}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-75" />
            <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-xl p-8 text-left hover:border-emerald-400 transition-all cursor-pointer">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-lg mb-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t.local}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.localDesc}
              </p>
            </div>
          </motion.button>
        </div>

        {/* Cancel Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
