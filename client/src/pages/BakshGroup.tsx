import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Target,
  Globe,
  Shield,
  Briefcase,
  Truck,
  Anchor,
  Ship,
  Award,
  Network,
  TrendingUp,
  HeartHandshake,
  Handshake
} from 'lucide-react';

const BakshGroup: React.FC = () => {
  const groupOverview = {
    title: "Baksh Group - A Legacy of Excellence",
    description: "Baksh Group is a diversified business conglomerate with a rich history spanning over seven decades. With our headquarters in Pakistan, we have established ourselves as a trusted name in shipping, logistics, and investment sectors, delivering excellence through innovation, integrity, and customer-centric solutions.",
    foundingYear: "1951",
    employees: "500+",
    globalPresence: "20+ Countries"
  };

  const coreValues = [
    { icon: Shield, title: 'Integrity', description: 'Upholding the highest standards of business ethics and transparency across all our operations' },
    { icon: Target, title: 'Excellence', description: 'Consistently delivering superior service and operational efficiency in every business vertical' },
    { icon: Network, title: 'Synergy', description: 'Leveraging the collective strength of our group companies to create value' },
    { icon: Globe, title: 'Global Perspective', description: 'Maintaining a worldwide outlook while staying rooted in local expertise' },
    { icon: HeartHandshake, title: 'Customer Focus', description: 'Building lasting relationships through exceptional service and support' },
    { icon: TrendingUp, title: 'Sustainable Growth', description: 'Balancing business success with social responsibility and environmental stewardship' },
  ];

  const groupCompanies = [
    {
      name: "Baksh Investment Limited",
      description: "The flagship company of Baksh Group, specializing in shipping agency services and maritime solutions with a legacy of excellence.",
      icon: Briefcase,
      year: "1967",
      services: ["Shipping Agencies", "Container Trading", "Freight Forwarding"]
    },
    {
      name: "Yaaseen Shipping Lines",
      description: "A leading name in global shipping services, connecting international markets with reliable and efficient maritime solutions.",
      icon: Ship,
      year: "2005",
      services: ["Liner Services", "Chartering", "Vessel Operations"]
    },
    {
      name: "Yaaseen Shipping Lines (PVT) Ltd",
      description: "Specialized in project cargo and heavy-lift operations, offering comprehensive logistics solutions worldwide.",
      icon: Anchor,
      year: "2008",
      services: ["Project Cargo", "Heavy Lift", "Oversized Cargo"]
    },
    {
      name: "UOSL Shipping & Logistics",
      description: "Providing end-to-end logistics solutions with a focus on efficiency, reliability, and customer satisfaction.",
      icon: Truck,
      year: "2007",
      services: ["Land Transport", "Warehousing", "Customs Clearance"]
    }
  ];

  const milestones = [
    {
      year: '1951',
      title: 'Humble Beginnings',
      event: 'Founding of our first venture in maritime trade',
      icon: Ship
    },
    {
      year: '1967',
      title: 'Formal Incorporation',
      event: 'Baksh Investment Limited was incorporated',
      icon: Building2
    },
    {
      year: '2005',
      title: 'New Horizons',
      event: 'Launch of Yaaseen Shipping Lines',
      icon: Globe
    },
    {
      year: '2006',
      title: 'Strategic Partnerships',
      event: 'Appointed as agents for STX Pan Ocean Co Ltd (now Pan Ocean)',
      icon: Handshake
    },
    {
      year: '2007',
      title: 'Logistics Expansion',
      event: 'Inception of UOSL Shipping & Logistics',
      icon: Truck
    },
    {
      year: '2008',
      title: 'Specialized Services',
      event: 'Established off-dock empty container depots in Karachi and Lahore.',
      icon: Anchor
    },
    {
      year: '2024',
      title: 'Global Recognition',
      event: 'Expansion to 20+ countries with comprehensive logistics solutions',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-white overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8cGF0aCBkPSJNNTAgMjVjMC0xMC0xMC0xNS0yMC0xNXMtMjAgNS0yMCAxNSAxMCAxNSAyMCAxNSAyMC01IDIwLTE1WiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LDEzMCwyNDYsMC4wNSkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')]"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 text-sm font-medium rounded-full mb-6 border border-blue-400/30">
              Since 1951
            </span> */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Building Global <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Connections</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Seven decades of excellence in shipping, logistics, and investment solutions across 20+ countries
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
              {/* <motion.a
                href="#our-companies"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Our Companies
              </motion.a> */}
              <motion.a
                href="/contact"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Get in Touch
              </motion.a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {[
              { value: '70+', label: 'Years of Experience' },
              { value: '20+', label: 'Countries Served' },
              { value: '500+', label: 'Dedicated Team' },
              { value: '24/7', label: 'Global Support' }
            ].map((stat, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
            <motion.div 
              className="w-1 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>
      
      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{groupOverview.foundingYear}+</div>
              <h3 className="text-lg font-semibold text-gray-800">Years of Excellence</h3>
              <p className="text-gray-600">Since our founding</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{groupOverview.employees}</div>
              <h3 className="text-lg font-semibold text-gray-800">Dedicated Professionals</h3>
              <p className="text-gray-600">Across our group companies</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{groupOverview.globalPresence}</div>
              <h3 className="text-lg font-semibold text-gray-800">Global Network</h3>
              <p className="text-gray-600">And expanding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Group Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Companies</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {groupCompanies.map((company, index) => {
              const Icon = company.icon;
              return (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{company.name}</h3>
                        <p className="text-blue-600 text-sm">Est. {company.year}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{company.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {company.services.map((service, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey Through Time</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 w-1 h-full bg-blue-200"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className="relative">
                    {/* For mobile */}
                    <div className="md:hidden">
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm text-blue-600 font-medium">{milestone.year}</span>
                            <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600">{milestone.event}</p>
                      </div>
                    </div>
                    
                    {/* For desktop */}
                    <div className="hidden md:flex items-center justify-between">
                      {isEven ? (
                        <>
                          <div className="w-5/12 px-4 py-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                            </div>
                            <p className="text-gray-600 pl-13">{milestone.event}</p>
                          </div>
                          <div className="w-1/6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                              {milestone.year}
                            </div>
                          </div>
                          <div className="w-5/12"></div>
                        </>
                      ) : (
                        <>
                          <div className="w-5/12"></div>
                          <div className="w-1/6 flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                              {milestone.year}
                            </div>
                          </div>
                          <div className="w-5/12 px-4 py-6 bg-white rounded-lg shadow-md">
                            <div className="flex items-center mb-2">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <Icon className="h-5 w-5 text-blue-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                            </div>
                            <p className="text-gray-600 pl-13">{milestone.event}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section
      <section className="relative py-24 bg-gradient-to-br from-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8cGF0aCBkPSJNNTAgMjVjMC0xMC0xMC0xNS0yMC0xNXMtMjAgNS0yMCAxNSAxMCAxNSAyMCAxNSAyMC01IDIwLTE1WiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-6 border border-white/20">
            Let's Work Together
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
            Powering <span className="bg-gradient-to-r from-blue-300 to-blue-100 text-transparent bg-clip-text">Global Trade</span> with Seven Decades of Excellence
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Partner with Baksh Group and leverage our extensive network, industry expertise, and innovative solutions to navigate the complexities of international shipping and logistics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.a
              href="/contact"
              className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
            </motion.a>
            <motion.a
              href="/about"
              className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.a>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default BakshGroup;
