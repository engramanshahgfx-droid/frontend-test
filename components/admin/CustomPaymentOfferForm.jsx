'use client';

import { useState } from 'react';
import styles from './CustomPaymentOfferForm.module.css';

export default function CustomPaymentOfferForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    amount: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [showLink, setShowLink] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setPaymentLink('');
    setShowLink(false);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/custom-payment-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✓ Payment offer created successfully!');
        setPaymentLink(data.data.payment_link);
        setShowLink(true);
        
        // Clear form
        setFormData({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          amount: '',
          description: '',
        });
      } else {
        setMessage('✗ Error: ' + (data.message || 'Failed to create offer'));
      }
    } catch (error) {
      setMessage('✗ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Custom Payment Offer</h1>
        <p className={styles.subtitle}>Create a unique payment link to send to customers</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Customer Name */}
          <div className={styles.formGroup}>
            <label htmlFor="customer_name" className={styles.label}>
              Customer Name *
            </label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter customer full name"
              required
              className={styles.input}
            />
          </div>

          {/* Customer Email */}
          <div className={styles.formGroup}>
            <label htmlFor="customer_email" className={styles.label}>
              Customer Email *
            </label>
            <input
              type="email"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="Enter customer email"
              required
              className={styles.input}
            />
          </div>

          {/* Customer Phone */}
          <div className={styles.formGroup}>
            <label htmlFor="customer_phone" className={styles.label}>
              Customer Phone *
            </label>
            <input
              type="tel"
              id="customer_phone"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="Enter customer phone number"
              required
              className={styles.input}
            />
          </div>

          {/* Amount */}
          <div className={styles.formGroup}>
            <label htmlFor="amount" className={styles.label}>
              Amount (SAR) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              min="0.01"
              required
              className={styles.input}
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description (What are they paying for?) *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter offer description (e.g., 'Package Tour to Dubai', 'Training Course', etc.)"
              rows="4"
              required
              className={styles.textarea}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Creating...' : 'Create Payment Link'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className={`${styles.message} ${message.includes('✓') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        {/* Payment Link Display */}
        {showLink && paymentLink && (
          <div className={styles.linkSection}>
            <h3 className={styles.linkTitle}>Your Payment Link</h3>
            <p className={styles.linkDescription}>
              Copy and send this link to your customer:
            </p>
            <div className={styles.linkBox}>
              <input
                type="text"
                value={paymentLink}
                readOnly
                className={styles.linkInput}
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className={styles.copyButton}
              >
                Copy Link
              </button>
            </div>
            <p className={styles.linkNote}>
              Customer will click this link and pay through Moyasar directly
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
