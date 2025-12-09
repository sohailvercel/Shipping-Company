import React from 'react';
import { motion } from 'framer-motion';
import {Instagram } from 'lucide-react';
import { SiFacebook, SiLinkedin } from 'react-icons/si';

const SocialMedia: React.FC = () => {
  const socialPlatforms = [
{
      name: 'Facebook',
      icon: SiFacebook, // filled brand icon
      url: 'https://facebook.com/yaaseenshippinglines',
      iconColor: 'text-white',
      bg: 'bg-[#1877F2] group-hover:bg-[#166FE5]',
      description: 'Follow us for daily updates and company news'
    },
    {
      name: 'LinkedIn',
      icon: SiLinkedin, // filled brand icon
      url: 'https://linkedin.com/company/yaaseen-shipping-lines',
      iconColor: 'text-white',
      bg: 'bg-[#0A66C2] group-hover:bg-[#0753A4]',
      description: 'Connect with us professionally'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/yaaseenshippinglines',
      // White icon on brand gradient background to match the logo
      iconColor: '#FFFFFF',
      gradient: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      description: 'Interact with us on Instagram'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-8 relative bg-blue-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
            CONNECT WITH US
          </h2>
          <p className="text-blue-600 max-w-2xl mx-auto text-sm">
            Stay connected for the latest updates and insights
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={platform.name}
                className="group"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-white rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-md border border-blue-100"
                  title={platform.description}
                >
                  <div
                    className={[
                      'flex items-center justify-center w-12 h-12 rounded-full mr-3 shadow-sm transition-colors',
                      platform.gradient ? platform.gradient : platform.bg
                    ].join(' ')}
                  >
                    {/* lucide uses currentColor; set via style for exact hex */}
                    <Icon className="w-5 h-5" style={{ color: platform.iconColor }} />
                  </div>
                  <span className="text-blue-800 font-medium">{platform.name}</span>
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialMedia;