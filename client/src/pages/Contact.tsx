import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building2,
  Globe,
  MessageCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  fax?: string;
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const Contact: React.FC = () => {
  const [selectedOffice, setSelectedOffice] = useState('karachi');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    serviceType: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const offices: Office[] = [
    {
      id: 'karachi',
      name: 'Karachi Office (Head Office)',
      address: '10th Floor, Sheikh Sultan Trust Building, Beaumont Road, Karachi',
      phone: '+92-21-35688057-59, 35693004, 6, 7',
      fax: '+92-21-35683051, 35687367',
      email: 'info@yslpk.com',
      hours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
      coordinates: { lat: 24.8607, lng: 67.0011 }
    },
    {
      id: 'lahore',
      name: 'Lahore Office',
      address: 'Office no E9C/2, 9th Floor,Grand Square Mall, Gulberg III Lahore',
      phone: '+92-42-35764134-5, 35772049',
      email: 'lahore@yslpk.com',
      hours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
      coordinates: { lat: 31.5204, lng: 74.3587 }
    },
    {
      id: 'multan',
      name: 'Multan Office',
      address: '21 U Business City Plaza Bosan Road Multan',
      phone: '+92-61-6223356, 6223357',
      email: 'multan@yslpk.com',
      hours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
      coordinates: { lat: 30.1575, lng: 71.5249 }
    },
    {
      id: 'faisalabad',
      name: 'Faisalabad Office',
      address: '22, Chenab Market, Madina Town, Faisalabad, Pakistan',
      phone: '+92-41-8532256-7',
      email: 'faisalabad@yslpk.com',
      hours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
      coordinates: { lat: 31.4504, lng: 73.1350 }
    }
  ];

  const serviceTypes = [
    'Liner Shipping Services',
    'Ocean Freight (FCL/LCL)',
    'Freight Forwarding',
    'Container Services',
    'Vessel Handling',
    'Chartering & Brokerage',
    'Project Cargo',
    'General Inquiry',
    'Other'
  ];

  // Safely get the current office with type assertion
  const currentOffice = offices.find(office => office.id === selectedOffice) as Office;

  // Safely get office name
  const getOfficeName = () => {
    const parts = currentOffice.name.split('(');
    return parts[0]?.trim() || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Get API Key from server
      const apiUrl = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
      const configResponse = await axios.get(`${apiUrl}/api/contact/config`);
      const apiKey = configResponse.data.apiKey;

      if (!apiKey) {
        throw new Error('Could not retrieve API key from server');
      }

      // 2. Submit directly to Web3Forms
      const response = await axios.post("https://api.web3forms.com/submit", {
        access_key: apiKey,
        ...contactForm,
        subject: `New Contact Message: ${contactForm.subject}`
      });

      if (response.status === 200) {
        setIsSubmitted(true);
        console.log('Form submitted:', response.data);

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setContactForm({
            name: '',
            email: '',
            phone: '',
            company: '',
            subject: '',
            message: '',
            serviceType: ''
          });
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Submission failed'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative text-white py-16 overflow-hidden" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1505839673365-e3971f8d9184?auto=format&fit=crop&w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gray-900/70"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 backdrop-blur-sm" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 backdrop-blur-sm" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our maritime experts across Pakistan. We're here to help with all your shipping and logistics needs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">24/7 Support</h3>
                <p className="text-blue-100 text-sm">Round-the-clock customer assistance</p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MapPin className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">4 Locations</h3>
                <p className="text-blue-100 text-sm">Offices across Pakistan's major cities</p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Globe className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-white">Global Network</h3>
                <p className="text-blue-100 text-sm">Worldwide shipping connections</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Send className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
              </div>

              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        id="company"
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      id="subject"
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                    <select
                      id="serviceType"
                      value={contactForm.serviceType}
                      onChange={(e) => setContactForm({ ...contactForm, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value="">Select a service</option>
                      {serviceTypes.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      id="message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Office Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
              <div className="flex items-center mb-6">
                <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Our Offices</h2>
              </div>

              {/* Office Selector */}
              <div className="grid grid-cols-2 gap-2 mb-8">
                {offices.map((office) => (
                  <button
                    key={office.id}
                    onClick={() => setSelectedOffice(office.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${selectedOffice === office.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                      }`}
                  >
                    {office.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Selected Office Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedOffice}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentOffice.name}</h3>
                      <p className="text-gray-600">{currentOffice.address}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <p className="text-gray-600">{currentOffice.phone}</p>
                          {currentOffice.fax && (
                            <p className="text-gray-600">Fax: {currentOffice.fax}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <a href={`mailto:${currentOffice.email}`} className="text-blue-600 hover:underline">
                            {currentOffice.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Working Hours</p>
                          <p className="text-gray-600">{currentOffice.hours}</p>
                        </div>
                      </div>
                    </div>

                    {/* Google Maps Link */}
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        Location on Map
                      </h4>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentOffice.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group relative rounded-lg overflow-hidden border border-gray-200 h-48"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundImage: `url('/images/${currentOffice.id}.jpg')`,
                            filter: 'brightness(0.9)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/10" />
                        </div>
                        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                          <MapPin className="w-8 h-8 text-white mb-2 drop-shadow-md" />
                          <p className="text-white font-medium text-lg drop-shadow-md">View on Map</p>
                          <p className="text-white/90 text-sm mt-1 drop-shadow">
                            {getOfficeName()}
                          </p>
                          <span className="mt-3 bg-white/90 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Open in Google Maps <ExternalLink className="w-3 h-3 ml-1 inline-block" />
                          </span>
                        </div>
                        <img
                          src={`/images/${currentOffice.id}.jpg`}
                          alt=""
                          className="hidden"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            const bgDiv = parent?.querySelector('div[style*="backgroundImage"]') as HTMLElement;
                            if (bgDiv) {
                              bgDiv.style.backgroundImage = 'url(\'/images/port-image.jpg\')';
                            }
                          }}
                        />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
