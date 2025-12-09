import { FC, ReactElement } from "react";
import { motion } from "framer-motion";
import {
  Container,
  ArrowRight,
  Ship,
  Truck,
  Anchor,
  Warehouse,
  ClipboardCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface IService {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  category: "main" | "e-service";
}

const services: IService[] = [
  // Main Services
  {
    id: "1",
    title: "Liner Shipping",
    icon: Ship,
    description:
      "Regular scheduled services with our partners across global routes.",
    category: "main",
  },
  {
    id: "2",
    title: "Freight Forwarding",
    icon: Truck,
    description:
      "Complete logistics solutions including air, sea, and land freight.",
    category: "main",
  },
  {
    id: "3",
    title: "Container Services",
    icon: Container,
    description:
      "FCL/LCL services with empty container depots across major ports.",
    category: "main",
  },
  {
    id: "4",
    title: "Ship Husbandry",
    icon: Anchor,
    description:
      "Port agency and vessel husbandry services for smooth operations.",
    category: "main",
  },
  {
    id: "5",
    title: "Warehousing",
    icon: Warehouse,
    description: "Secure storage and inventory management solutions.",
    category: "main",
  },
  {
    id: "6",
    title: "Customs Clearance",
    icon: ClipboardCheck,
    description:
      "Efficient handling of all customs documentation and clearance.",
    category: "main",
  },

  //   // E-Services
  //   {
  //     id: "7",
  //     title: "Cargo Tracking",
  //     icon: Package,
  //     description: "Real-time tracking of your shipments and containers.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "8",
  //     title: "Vessel Schedules",
  //     icon: Calendar,
  //     description: "Up-to-date vessel schedules and port calls.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "9",
  //     title: "Document Management",
  //     icon: FileText,
  //     description: "Upload, store and manage all your shipping documents.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "10",
  //     title: "Shipping News",
  //     icon: Newspaper,
  //     description: "Latest news and updates in the shipping industry.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "11",
  //     title: "Freight Calculator",
  //     icon: Calculator,
  //     description: "Calculate estimated freight costs for your shipments.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "12",
  //     title: "Container Management",
  //     icon: Container,
  //     description: "Track and manage your containers with our advanced system.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "13",
  //     title: "Market Insights",
  //     icon: BarChart2,
  //     description: "Access to shipping market trends and analysis.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "14",
  //     title: "Compliance & Security",
  //     icon: ShieldCheck,
  //     description: "Ensure your shipments meet all regulatory requirements.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "15",
  //     title: "Industry News",
  //     icon: Newspaper,
  //     description: "Stay informed with the latest updates and insights from the shipping industry.",
  //     category: 'e-service'
  //   },
  //   {
  //     id: "16",
  //     title: "Container Management",
  //     icon: Container,
  //     description: "Track and manage your containers with our advanced system.",
  //     category: 'e-service'
  //   }
];

const EServices: FC = (): ReactElement => {
  // Search & category filter removed from UI; keep simple listing

  const renderServiceCard = (service: IService, index: number) => (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <Link to={`/services/${service.id}`} className="block h-full">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-lg ${
                service.category === "main"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              <service.icon className="h-6 w-6" />
            </div>
            <h3 className="ml-4 text-xl font-semibold text-gray-900">
              {service.title}
            </h3>
          </div>
          <p className="text-gray-600 flex-grow">{service.description}</p>
          <div className="mt-4 flex items-center text-blue-600 font-medium">
            <span>Learn more</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </motion.h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive range of shipping and logistics services
            designed to meet all your business needs.
          </p>
        </div>

        {/* <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          { Filter controls removed to keep only six main services }
        </div> */}

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No services found matching your search.
            </p>
          </div>
        ) : (
          <>
            {true && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Main Shipping Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services
                    .filter((service) => service.category === "main")
                    .map((service, index) => renderServiceCard(service, index))}
                </div>
              </div>
            )}
            {/* E-Services section removed */}
          </>
        )}
      </div>
    </div>
  );
};

export default EServices;
