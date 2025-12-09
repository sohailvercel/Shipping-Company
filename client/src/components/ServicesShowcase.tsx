import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ship, 
  Anchor, 
  Truck, 
  Container, 
  Globe, 
  Package,
  Wrench,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
  image: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  services: Service[];
}

const ServicesShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('liner');
  const [activeService, setActiveService] = useState<string | null>(null);

  const serviceCategories: ServiceCategory[] = [
    {
      id: 'liner',
      title: 'Liner Shipping Services',
      description: 'Comprehensive shipping solutions with regular scheduled services',
      services: [
        {
          id: 'shipping-agency',
          title: 'Shipping Agency',
          description: 'Professional representation for vessel owners and operators',
          icon: Ship,
          features: ['Vessel husbandry', 'Port coordination', 'Documentation', 'Customs clearance'],
          color: 'from-blue-500 to-blue-600',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          id: 'consolidated-cargo',
          title: 'Consolidated Cargo',
          description: 'Efficient LCL services for smaller shipments',
          icon: Package,
          features: ['LCL consolidation', 'Cargo tracking', 'Flexible scheduling', 'Cost optimization'],
          color: 'from-green-500 to-green-600',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
        },
        {
          id: 'container-services',
          title: 'Container Services',
          description: 'Full container load services with modern equipment',
          icon: Container,
          features: ['FCL services', 'Special equipment', 'Reefer containers', 'Container trading'],
          color: 'from-purple-500 to-purple-600',
          image: 'https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 'ocean-freight',
      title: 'Ocean Freight',
      description: 'Complete ocean transportation solutions worldwide',
      services: [
        {
          id: 'fcl-services',
          title: 'FCL Services',
          description: 'Full Container Load services for large shipments',
          icon: Container,
          features: ['Direct loading', 'Multiple container types', 'Door-to-door delivery', 'Real-time tracking'],
          color: 'from-indigo-500 to-indigo-600',
          image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
        },
        {
          id: 'lcl-services',
          title: 'LCL Services',
          description: 'Less than Container Load for smaller shipments',
          icon: Package,
          features: ['Consolidated shipping', 'Flexible volumes', 'Weekly sailings', 'Competitive rates'],
          color: 'from-teal-500 to-teal-600',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
        },
        {
          id: 'special-equipment',
          title: 'Special Equipment',
          description: 'Specialized containers for unique cargo requirements',
          icon: Wrench,
          features: ['Reefer containers', 'Open-top containers', 'Flat rack containers', 'Tank containers'],
          color: 'from-orange-500 to-orange-600',
          image: 'https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 'logistics',
      title: 'Logistics & Forwarding',
      description: 'End-to-end logistics solutions and freight forwarding',
      services: [
        {
          id: 'freight-forwarding',
          title: 'Freight Forwarding',
          description: 'Complete logistics coordination and management',
          icon: Truck,
          features: ['Multi-modal transport', 'Customs brokerage', 'Documentation', 'Insurance'],
          color: 'from-red-500 to-red-600',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          id: 'project-cargo',
          title: 'Project Cargo',
          description: 'Specialized handling for oversized and heavy cargo',
          icon: Wrench,
          features: ['Heavy lift cargo', 'Oversized shipments', 'Project coordination', 'Special handling'],
          color: 'from-yellow-500 to-yellow-600',
          image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
        },
        {
          id: 'transportation',
          title: 'Transportation',
          description: 'Domestic and international ground transportation',
          icon: Truck,
          features: ['Door-to-door delivery', 'Nationwide coverage', 'Secure transport', 'Time-definite delivery'],
          color: 'from-pink-500 to-pink-600',
          image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 'specialized',
      title: 'Specialized Services',
      description: 'Premium services for unique maritime requirements',
      services: [
        {
          id: 'vessel-handling',
          title: 'Vessel Handling',
          description: 'Complete vessel support and maintenance services',
          icon: Anchor,
          features: ['Vessel handling', 'Ship supply', 'Crew services', 'Port coordination'],
          color: 'from-cyan-500 to-cyan-600',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
        },
        {
          id: 'chartering',
          title: 'Chartering & Brokerage',
          description: 'Vessel chartering and maritime brokerage services',
          icon: Ship,
          features: ['Vessel chartering', 'Maritime brokerage', 'Market analysis', 'Contract negotiation'],
          color: 'from-emerald-500 to-emerald-600',
          image: 'https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=400&h=300&fit=crop'
        },
        {
          id: 'stevedoring',
          title: 'Stevedoring',
          description: 'Professional cargo handling at ports',
          icon: Wrench,
          features: ['Cargo handling', 'Terminal operations', 'Equipment provision', 'Safety management'],
          color: 'from-violet-500 to-violet-600',
          image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop'
        }
      ]
    }
  ];

  const currentCategory = serviceCategories.find(cat => cat.id === activeCategory)!;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Globe className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive maritime and logistics solutions tailored to meet your business needs
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveService(null);
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
              }`}
            >
              {category.title}
            </button>
          ))}
        </motion.div>

        {/* Category Description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {currentCategory.title}
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {currentCategory.services.map((service) => {
              const Icon = service.icon;
              const isActive = activeService === service.id;
              
              return (
                <motion.div
                  key={service.id}
                  className="group cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveService(isActive ? null : service.id)}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-primary-300">
                    {/* Service Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-80`} />
                      <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features Preview */}
                      <div className="space-y-2 mb-6">
                        {service.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                        {service.features.length > 2 && (
                          <div className="text-sm text-primary-600 font-medium">
                            +{service.features.length - 2} more features
                          </div>
                        )}
                      </div>

                      
                      {/* Learn More Link */}
                      <Link to="/services" className="text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors flex items-center group">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Contact our experts today to discuss your specific shipping and logistics requirements
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg px-8 py-3 font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us Today
                </motion.a>
                
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
