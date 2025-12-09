import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ship, Users, Award, Clock } from "lucide-react";
import HeroCarousel from "../components/HeroCarousel";
// import Testimonials from '../components/Testimonials';
import SocialMedia from "../components/SocialMedia";
// import { pageBackgrounds } from '../assets/videos';
const Home: React.FC = () => {
  const stats = [
    {
      icon: Ship,
      label: "75+ Years of Excellence",
      description: "Serving in maritime industry since 1951",
      iconClass: "text-teal-500/90", // Teal with slight transparency
    },
    {
      icon: Users,
      label: "Satisfied Clients",
      description: "Trusted by leading companies worldwide",
      iconClass: "text-amber-500/90", // Amber with slight transparency
    },
    {
      icon: Award,
      label: "4 Offices in Major Cities",
      description: "Serving customers nationwide",
      iconClass: "text-indigo-400/90", // Soft indigo with slight transparency
    },
    {
      icon: Clock,
      label: "24/7 Customer Support",
      description: "Round-the-clock assistance and monitoring",
      iconClass: "text-emerald-500/90", // Emerald with slight transparency
    },
  ];

  const quickServices = [
    { id: "1", title: "Liner Agency" },
    { id: "2", title: "Freight Forwarding" },
    { id: "3", title: "Transportation" },
    { id: "4", title: "Depot Service" },
    { id: "5", title: "Vessel Handling" },
    { id: "6", title: "Chartering and Stevedoring" },
    { id: "7", title: "Project Cargo Handling" },
    { id: '8', title: 'Ship Husbandry' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Company Stats */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Trusted Maritime Partner
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seven decades of excellence in maritime services, connecting Pakistan to global trade routes
            </p>
          </motion.div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{
                  delay: 0.15 * index,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    delay: 0.15 * index + 0.3,
                    duration: 0.6,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <stat.icon className={`h-10 w-10 mb-4 ${stat.iconClass}`} />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.5 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Our Services
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickServices.map((service, index) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="block h-48"
              >
                <motion.div
                  initial={{ opacity: 0, y: 60, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ amount: 0.3 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 * index,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                    rotateY: 2,
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-300"
                >
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(/images/service-${service.id}.jpg), 
                                      url(/images/service-${service.id}.jpeg), 
                                      url(/images/service-${service.id}.png)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20 flex items-center justify-center p-4 group-hover:from-blue-900/90 group-hover:via-blue-800/70 group-hover:to-blue-900/50 transition-all duration-300">
                      <motion.h3
                        className="text-xl font-bold text-white text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.3 }}
                        transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
                      >
                        {service.title}
                      </motion.h3>
                    </div>
                  </div>

                  {/* Animated border effect on hover */}
                  <motion.div
                    className="absolute inset-0 border-2 border-blue-400 rounded-2xl opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA - Clean Split Layout */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left side - Content */}
              <motion.div
                className="p-8 md:p-10 lg:p-12"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div className="max-w-md mx-auto lg:mx-0">
                  <motion.span
                    className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Get in Touch
                  </motion.span>
                  <motion.h2
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    Let's work <span className="text-blue-600">together</span>{" "}
                    on your destination
                  </motion.h2>
                  <motion.p
                    className="text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.3 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    Guiding you through the challenges of global shipping and
                    logistics with expertise and reliability. Our team of
                    experts is ready to provide personalized solutions for your
                    destination
                  </motion.p>
                </div>
              </motion.div>

              {/* Right side - Image */}
              <motion.div
                className="h-64 md:h-80 lg:h-auto lg:min-h-[300px]"
                initial={{ opacity: 0, x: 50, scale: 1.1 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: "url(/images/blala.jpg)" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media */}
      <div className="pt-8 pb-12">
        <SocialMedia />
      </div>
    </div>
  );
};

export default Home;
