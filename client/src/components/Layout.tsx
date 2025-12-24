import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import WhatsAppButton from './WhatsAppButton';
import Footer from './Footer'; // ✅ Make sure this import path is correct

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const [whatsappNumber, setWhatsappNumber] = React.useState<string>("+92 333 3636403");

  // Fetch public config
  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/config/tracking-url`);
        const result = await response.json();
        if (result.success && result.data.whatsappNumber) {
          setWhatsappNumber(result.data.whatsappNumber);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  // Don't show WhatsApp button on dashboard, login, or admin pages
  const showWhatsAppButton =
    !path.includes('/dashboard') && !path.includes('/login') && !path.includes('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* WhatsApp Button */}
      {showWhatsAppButton && <WhatsAppButton phoneNumber={whatsappNumber} />}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
