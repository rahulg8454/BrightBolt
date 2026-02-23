import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import '../styles/pagesStyle/contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const { name, email, message } = formData;
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axiosInstance.post('/api/contact/submit', formData);
        if (response.status === 200) {
          setSuccessMessage('Your message has been sent successfully! Admin will reply to your email.');
          setFormData({ name: '', email: '', message: '' });
        } else {
          setSuccessMessage('Failed to send your message. Please email us directly.');
        }
      } catch (error) {
        setSuccessMessage('An error occurred. Please email admin directly at rahul01.org@gmail.com');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2 className="contact-title">Contact & Support</h2>
        <p className="contact-subtitle">Have a question or need help? We're here for you!</p>

        {/* Direct Contact Info */}
        <div className="contact-info-box">
          <h3>Direct Contact</h3>
          <div className="contact-info-item">
            <span className="contact-info-icon">&#9993;</span>
            <div>
              <strong>Admin Email</strong>
              <p>For account issues, password resets, or any help:</p>
              <a href="mailto:rahul01.org@gmail.com" className="admin-email-link">rahul01.org@gmail.com</a>
            </div>
          </div>
          <div className="contact-info-item">
            <span className="contact-info-icon">&#9201;</span>
            <div>
              <strong>Response Time</strong>
              <p>Admin typically responds within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Help Topics */}
        <div className="help-topics">
          <h3>Common Help Topics</h3>
          <ul>
            <li>&#128274; Forgot your password? Contact admin to reset it</li>
            <li>&#128100; New user? Ask admin to create your account</li>
            <li>&#128203; Quiz not loading? Describe the issue below</li>
            <li>&#128202; Results not showing? Email admin with your username</li>
          </ul>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="contact-form">
          <h3>Send a Message</h3>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your issue or question..."
              rows={5}
              className={errors.message ? 'input-error' : ''}
            />
            {errors.message && <p className="error">{errors.message}</p>}
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {successMessage && <p className="success">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
