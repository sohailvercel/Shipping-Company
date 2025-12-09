import { FC, ReactElement, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Ship, Truck, Package, Anchor } from 'lucide-react';

interface IService {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  color: string;
}

const defaultServices: IService[] = [
  {
    id: '1',
    title: 'Liner Agency',
    description: 'Professional agency services for shipping lines',
    longDescription: 'As a leading Shipping Agent, we provide end to end agency services to our Principals. Our team is well equipped with vessel handling, managing special equipment and committed to safeguarding our Principals interests.',
    icon: 'ship',
    features: [
      'Efficient handling of import and export shipments',
      'Trained staff to handle all kinds of containerized cargo',
      'In-house integrated Shipping software with EDI capabilities',
      'Maintaining prompt correspondence with our maintained principals',
      'Proactive sales staff',
      'FCL & LCL Shipping'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: '2',
    title: 'Freight Forwarding',
    description: 'End-to-end logistics solutions worldwide',
    longDescription: 'Our specialized freight forwarding team handles every element of cargo movement, ensuring smooth global connectivity. We offer air, sea, and land transportation, ensuring your goods are delivered efficiently and cost-effectively.',
    icon: 'truck',
    features: [
      'Multimodal transport solutions',
      'Efficent Customs clearance',
      'Inland Haulage',
      'Real-time tracking',
      'Door-to-door service',
      '24/7 Custom Service'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    id: '3',
    title: 'Transportation',
    description: 'Reliable road haulage and cargo movement',
    longDescription: 'We provide effortless movement of goods with a modern fleet and trusted drivers. We offer local and nationwide transportation solutions.',
    icon: 'truck',
    features: [
      'Fully- equipped fleet',
      'Temperature-controlled transport',
      'Dangerous goods handling',
      'GPS tracking',
      'Empty units transportation to / from terminal / depot and up-country',
      'We provide empty unit transportation service to / from terminal / depot and up-country as needed'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: '4',
    title: 'Depot Service',
    description: 'Efficient container depot services',
    longDescription: 'Our empty depots are located at Prime locations with easy accessibility for transporters. We have the reliable resources for container positioning and management to support your logistics operations.',
    icon: 'package',
    features: [
      'Prime locations in Karachi & Lahore',
      'Professional MNR Team',
      'Equipment inspections & monitoring',
      'IICL Surveyor',
      'Dry/ Reefer & specials handling',
      'Reefer PTI/ Security & Surveillance',
      'Round-the-clock-service',
      'Strictly follow FIFO method'

    ],
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: '5',
    title: 'Vessel Handling',
    description: 'Comprehensive vessel support services',
    longDescription: 'Our ship husbandry services ensure smooth port operations for vessels. We coordinate all necessary services including crew changes, provisions, spare parts, and technical support to minimize vessel turnaround time.',
    icon: 'anchor',
    features: [
      'Vessel arrival and berthing prospects',
      'Bulk cargo handling',
      'Technical support',
      'Supervision of cargo loading and discharging operations',
      'Monitoring vessel performance',
      'Coordination with government and port authorities'

    ],
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: '6',
    title: 'Chartering and Stevedoring',
    description: 'Vessel chartering and cargo handling services',
    longDescription: 'We provide professional vessel chartering services tailored to all types and sizes of ships. Our stevedoring services ensure efficient loading and unloading operations with experienced personnel and modern equipment.',
    icon: 'anchor',
    features: [
      'Market analysis and freight rate assessment',
      'Time charter/ voyage charter',
      'State of the art  equipment to handle various types of cargo',
      'Cargo handling supervision',
      'CFS Yard and cross stuffing',
      'Cargo lashing and securing'

    ],
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: '7',
    title: 'Project Cargo Handling',
    description: 'Specialized handling for oversized and heavy lift cargo',
    longDescription: 'Our project cargo division specializes in handling oversized, heavy lift, and complex project shipments. We provide end-to-end solutions including engineering, route surveys, and specialized equipment.',
    icon: 'package',
    features: [
      'Oversized cargo handling',
      'Route planning and surveys',
      'Heavy lift cranes and specialized equipment',
      'Oil and gas/ energy sector expertise'
    ],
    color: 'from-red-500 to-pink-600'
  },
  {
    id: '8',
    title: 'Ship Husbandry',
    description: 'Comprehensive ship husbandry services for vessels',
    longDescription: 'We provide reliable and efficient ship husbanding services to ensure smooth port operations. From crew handling and customs clearance to provisions, bunkering, and repairs, our experienced team manages every detail with precision. With strong ties to port authorities and service providers, we guarantee fast turnaround, cost efficiency, and complete compliance.',
    icon: 'ship',
    features: [
      'Crew change assistance',
      'Customs, immigration, and port clearance formalities',
      'Ship repairs and maintenance arrangements',
      'Fresh water, provisions, and spare parts delivery',
      'Liaison with port authorities and terminal operators',
      'Bunker supply.'

    ],
    color: 'from-indigo-500 to-violet-600'
  }
  // {
  //   id: '9',
  //   title: 'Customs Clearance',
  //   description: 'Efficient handling of all customs documentation and clearance',
  //   longDescription: 'Our customs clearance services ensure your shipments comply with all import/export regulations. We handle all necessary documentation and work closely with customs authorities to prevent delays.',
  //   icon: 'clipboard-check',
  //   features: [
  //     'Import/export documentation',
  //     'Duty and tax calculation',
  //     'Regulatory compliance',
  //     'Customs brokerage',
  //     'Duty drawback services'
  //   ],
  //   color: 'from-amber-500 to-orange-600'
  // },
  // {
  //   id: '7',
  //   title: 'Cargo Tracking',
  //   description: 'Real-time tracking of your shipments and containers',
  //   longDescription: 'Our advanced cargo tracking system provides real-time visibility of your shipments worldwide. Get instant updates on location, temperature, and estimated time of arrival.',
  //   icon: 'map-pin',
  //   features: [
  //     'Real-time GPS tracking',
  //     'Temperature monitoring',
  //     'Automated alerts',
  //     'Mobile access',
  //     'Custom reporting'
  //   ],
  //   color: 'from-emerald-500 to-green-600'
  // },
  // {
  //   id: '8',
  //   title: 'Vessel Schedules',
  //   description: 'Up-to-date vessel schedules and port calls',
  //   longDescription: 'Access our comprehensive database of vessel schedules and port calls to plan your shipments efficiently. Our system is updated in real-time with the latest schedule changes and port conditions.',
  //   icon: 'calendar',
  //   features: [
  //     'Real-time schedule updates',
  //     'Port congestion alerts',
  //     'Route optimization',
  //     'Historical data',
  //     'Custom schedule feeds'
  //   ],
  //   color: 'from-violet-500 to-purple-600'
  // },
  // {
  //   id: '9',
  //   title: 'Document Management',
  //   description: 'Upload, store and manage all your shipping documents',
  //   longDescription: 'Our secure document management system allows you to store, share, and manage all your shipping documents in one place. Access your documents anytime, anywhere with our cloud-based platform.',
  //   icon: 'file-text',
  //   features: [
  //     'Secure cloud storage',
  //     'Document sharing',
  //     'Version control',
  //     'Digital signatures',
  //     'Compliance archiving'
  //   ],
  //   color: 'from-rose-500 to-pink-600'
  // },
  // {
  //   id: '10',
  //   title: 'Shipping News',
  //   description: 'Latest news and updates in the shipping industry',
  //   longDescription: 'Stay informed with the latest developments in the shipping industry. Our news service provides timely updates on market trends, regulatory changes, and company announcements.',
  //   icon: 'newspaper',
  //   features: [
  //     'Daily industry updates',
  //     'Market analysis',
  //     'Regulatory changes',
  //     'Company news',
  //     'Custom alerts'
  //   ],
  //   color: 'from-blue-500 to-indigo-600'
  // },
  // {
  //   id: '11',
  //   title: 'Freight Calculator',
  //   description: 'Calculate estimated freight costs for your shipments',
  //   longDescription: 'Our freight calculator helps you estimate shipping costs based on various factors including origin, destination, weight, and dimensions. Get instant quotes for different shipping methods.',
  //   icon: 'calculator',
  //   features: [
  //     'Multi-modal rate comparison',
  //     'Currency conversion',
  //     'Surcharge calculation',
  //     'Save quotes',
  //     'Custom rate agreements'
  //   ],
  //   color: 'from-amber-400 to-orange-500'
  // },
  // {
  //   id: '12',
  //   title: 'Container Management',
  //   description: 'Track and manage your containers with our advanced system',
  //   longDescription: 'Our container management system provides end-to-end visibility and control of your container fleet. Monitor container status, location, and condition in real-time.',
  //   icon: 'box',
  //   features: [
  //     'Container tracking',
  //     'Maintenance scheduling',
  //     'Utilization reports',
  //     'Lease management',
  //     'Cost analysis'
  //   ],
  //   color: 'from-teal-500 to-cyan-600'
  // },
  // {
  //   id: '13',
  //   title: 'Market Insights',
  //   description: 'Access to shipping market trends and analysis',
  //   longDescription: 'Gain valuable insights into shipping market trends with our comprehensive analysis and reports. Make informed decisions based on real-time market data and expert analysis.',
  //   icon: 'bar-chart-2',
  //   features: [
  //     'Market trends',
  //     'Freight rate analysis',
  //     'Capacity forecasts',
  //     'Trade lane analysis',
  //     'Custom reports'
  //   ],
  //   color: 'from-indigo-500 to-purple-600'
  // },
  // {
  //   id: '14',
  //   title: 'Compliance & Security',
  //   description: 'Ensure your shipments meet all regulatory requirements',
  //   longDescription: 'Our compliance and security services help you navigate complex international trade regulations and ensure your shipments meet all security requirements.',
  //   icon: 'shield',
  //   features: [
  //     'Regulatory compliance',
  //     'Security screening',
  //     'Risk assessment',
  //     'Training programs',
  //     'Audit support'
  //   ],
  //   color: 'from-red-500 to-pink-600'
  // },
  // {
  //   id: '15',
  //   title: 'Industry News',
  //   description: 'Stay informed with the latest updates and insights from the shipping industry',
  //   longDescription: 'Access comprehensive coverage of the shipping industry, including market trends, regulatory updates, and company news. Our expert analysis helps you stay ahead in a competitive market.',
  //   icon: 'rss',
  //   features: [
  //     'Daily news updates',
  //     'Exclusive interviews',
  //     'Market analysis',
  //     'Event coverage',
  //     'Custom news alerts'
  //   ],
  //   color: 'from-blue-600 to-indigo-700'
  // }
];

const EServiceDetail: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<IService | undefined>();
  const navigate = useNavigate();
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch services from API first
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const foundService = services.find(s => s.id === id);
      if (!foundService) {
        // If service not found, redirect to services page
        navigate('/services');
        return;
      }
      setService(foundService);
    }
  }, [id, services, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The requested service could not be found.</p>
          <Link to="/services" className="text-blue-600 hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }


  // const IconComponent = 
  //   service.icon === 'ship' ? Ship :
  //   service.icon === 'truck' ? Truck :
  //   service.icon === 'container' ? Package :
  //   service.icon === 'anchor' ? Anchor : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Services
        </button> */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">


          {/* Header with gradient */}
          <div className={`${service.color} h-2 w-full`}></div>

          {/* Option 3: Background Header with Overlay */}
          <div
            className="relative h-96 w-full bg-cover bg-center group"
            style={{
              backgroundImage: `url(/images/service-${service.id}.jpg), 
                              url(/images/service-${service.id}.jpeg), 
                              url(/images/service-${service.id}.png)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {service.title}
              </h1>
              <p className="text-xl text-gray-100 max-w-3xl drop-shadow-md">
                {service.description}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10">


            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Service Overview
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {service.longDescription}
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Key Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {service.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* <div className="mt-12 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Ready to get started with our {service.title.toLowerCase()} service?
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                >
                  Contact Our Team
                </Link>
                <Link
                  to="/eservices"
                  className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                >
                  View All Services
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EServiceDetail;