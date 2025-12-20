import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
// In client/src/pages/About.tsx
import {
  Users,
  Award,
  Globe,
  Shield,
  Target,
  ArrowRight,
  Calendar,
} from "lucide-react";

const About: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  // const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  // Handle navigation from other pages with hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
      // Scroll to the section after a short delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);

  const companies = [
    {
      id: "baksh-investment",
      name: "Baksh Shipping Lines",
      // shortDescription:
      //   "Strategic investment and financial services company driving growth in the maritime sector.",
      description:
        "Baksh Shipping Lines was established in 1967 as part of the Group’s strategic initiative to expand and diversify its business operations. Our flexible service offerings include charter services",
      // icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      // link: "/baksh-shipping",
      // year: 2008,
      // employees: "200+",
      // locations: ["Karachi", "Dubai"],
      // values: [
      //   {
      //     icon: <BarChart2 className="w-5 h-5" />,
      //     title: "Excellence",
      //     description: "Superior performance",
      //   },
      //   {
      //     icon: <Users className="w-5 h-5" />,
      //     title: "Client Focus",
      //     description: "Tailored solutions",
      //   },
      //   {
      //     icon: <Award className="w-5 h-5" />,
      //     title: "Integrity",
      //     description: "Trust and transparency",
      //   },
      // ],
      // stats: [
      //   { value: "$500M+", label: "Assets Under Management" },
      //   { value: "50+", label: "Investment Projects" },
      //   { value: "15+", label: "Years Experience" },
      //   { value: "98%", label: "Client Retention" }
      // ]
    },
    {
      id: "yaaseen-shipping",
      name: "Yaaseen Shipping Lines",
      // shortDescription:
      //   "Leading maritime services provider with global reach and excellence in shipping solutions.",
      description:
        "Following the joint venture with OOCL in 2007, Yaaseen Shipping Lines was appointed as the exclusive booking agent for OOCL Pakistan in Lahore, Multan, and Faisalabad. ",
      // icon: <Ship className="w-8 h-8 text-blue-600" />,
      // link: "/yaaseen-about",
      // year: 2012,
      // employees: "500+",
      // locations: ["Karachi", "Dubai", "Singapore", "Istanbul"],
      // values: [
      //   {
      //     icon: <Globe className="w-5 h-5" />,
      //     title: "Global Reach",
      //     description: "Worldwide network",
      //   },
      //   {
      //     icon: <Clock className="w-5 h-5" />,
      //     title: "Reliability",
      //     description: "On-time delivery",
      //   },
      //   {
      //     icon: <Shield className="w-5 h-5" />,
      //     title: "Safety",
      //     description: "Highest standards",
      //   },
      // ],
      // stats: [
      //   { value: "50+", label: "Vessels" },
      //   { value: "100+", label: "Global Ports" },
      //   { value: "1M+", label: "TEUs Annually" },
      //   { value: "99.8%", label: "On-time Delivery" },
      // ],
    },
    {
      id: "yaaseen-pvt",
      name: "Yaaseen Shipping (Pvt) Ltd",
      shortDescription:
        "Specialized cargo solutions and vessel operations with a focus on efficiency and reliability.",
      description:
        "Yaaseen Shipping (PVT) Ltd specializes in providing comprehensive shipping and logistics solutions tailored to meet the specific needs of our clients. Our expertise includes container shipping, break bulk, special equipment equipment for sensitive or oversized shipments, and project cargo handling.",
      // icon: <Anchor className="w-8 h-8 text-blue-600" />,
      // link: "/yaaseen-shipping-pvt",
      // year: 2015,
      // employees: "300+",
      // locations: ["Karachi", "Lahore", "Istanbul"],
      // values: [
      //   {
      //     icon: <Users className="w-5 h-5" />,
      //     title: "Customer First",
      //     description: "Client satisfaction",
      //   },
      //   {
      //     icon: <Clock className="w-5 h-5" />,
      //     title: "Efficiency",
      //     description: "Optimal solutions",
      //   },
      //   {
      //     icon: <Shield className="w-5 h-5" />,
      //     title: "Reliability",
      //     description: "Consistent service",
      //   },
      // ],
      // stats: [
      //   { value: "30+", label: "Vessels" },
      //   { value: "50+", label: "Global Routes" },
      //   { value: "500K+", label: "TEUs Handled" },
      //   { value: "24/7", label: "Support" },
      // ],
    },
    {
      id: "uosl",
      name: "UOSL Shipping & Logistics (Pvt) Ltd",
      // shortDescription:
      //   "End-to-end logistics solutions with a focus on efficiency and customer satisfaction.",
      description:
        "UOSL Shipping and Logicsctics (Pvt) Ltd , is a part of BAKSH group of companies, UOSL has established Off Dock Empty Container Park located at Karachi within city limit at well known location for customers at Maripur Truck Stand Hawks bay Road Karachi and around 6-7 km from Karachi Port, having a storage area of 8 acres land on which storage / operation commenced from 11th-April-2008 with back up area of another 4 acres for expansion on 2nd phase, depot having boundary wall.",
      // icon: <Truck className="w-8 h-8 text-blue-600" />,
      // link: "/uosl",
      // year: 2018,
      // employees: "400+",
      // locations: ["Karachi", "Lahore", "Islamabad", "Dubai"],
      // values: [
      //   {
      //     icon: <Target className="w-5 h-5" />,
      //     title: "Innovation",
      //     description: "Advanced solutions",
      //   },
      //   {
      //     icon: <Users className="w-5 h-5" />,
      //     title: "Partnership",
      //     description: "Collaborative approach",
      //   },
      //   {
      //     icon: <BarChart2 className="w-5 h-5" />,
      //     title: "Efficiency",
      //     description: "Streamlined operations",
      //   },
      // ],
    },
    {
      id: "zoom",
      name: "Zoom World Pvt Ltd",
      // shortDescription:
      //   "End-to-end logistics solutions with a focus on efficiency and customer satisfaction.",
      description:
        "Zoom World Pvt Ltd was established in 2019 to provide comprehensive logistics solutions. Backed by the Baksh Group’s industry experience and strong market presence, Zoom World was formed to support Pakistan’s growing trade requirements.",
      // icon: <Truck className="w-8 h-8 text-blue-600" />,
      // link: "/zoom",
      // year: 2018,
      // employees: "400+",
      // locations: ["Karachi", "Lahore", "Islamabad", "Dubai"],
      // values: [
      //   {
      //     icon: <Target className="w-5 h-5" />,
      //     title: "Innovation",
      //     description: "Advanced solutions",
      //   },
      //   {
      //     icon: <Users className="w-5 h-5" />,
      //     title: "Partnership",
      //     description: "Collaborative approach",
      //   },
      //   {
      //     icon: <BarChart2 className="w-5 h-5" />,
      //     title: "Efficiency",
      //     description: "Streamlined operations",
      //   },
      // ],
    },
  ];
  const milestones = [
    {
      year: 1951,
      event:
        "Established as United Oriental Steamship Co. offering liner services between East Pakistan and West Pakistan",
    },
    {
      year: 1967,
      event:
        "Baksh Shipping Lines incorporated, expanding into stevedoring, terminal handling, and lighterage operations",
    },
    {
      year: 1981,
      event: "Yaaseen Shipping Lines established to represent principals",
    },
    {
      year: 1984,
      event: "Appointed as agents for Orient Overseas Container Line (OOCL).Served As Terminal Operators for OOCL From 1984 To 2002.",
    },
    {
      year: 2006,
      event: "Appointed as agents for STX Pan Ocean Co. Ltd. (now Pan Ocean)",
    },
    { year: 2007, event: "Appointed as agents for Maldives National Shipping" },
    {
      year: 2007,
      event: "A joint venture agreement with OOCL was formalized in pakistan",
    },
    {
      year: 2007,
      event:
        "Launched dedicated freight forwarding division under UOSL Shipping and Logistics Pvt Ltd",
    },
    {
      year: "2008",
      event:
        "Established off-dock empty container depot in Karachi under the name, UOSL Shipping And Logistics Pvt Ltd, offering Customized Logistics Solutions To Domestic And Regional Clients",
    },
    {
      year: "2011",
      event:
      "Opened a second off-dock empty container depot in Lahore, extending service to the same major clients.",
    },
    {
      year: "2013",
      event:
      "Appointed as agents for W Container Lines Ltd.",
    },
    {
      year: "2015",
      event:
      " Appointed as agents for China SOC Lines.",
    },
    {
      year: "2016",
      event:
      "Appointed as agents for Metro Logistics International Pvt Ltd.",
    },
    {
      year: "2019",
      event:
      "Launched A Dedicated Freight Forwarding Division under Zoom World (Pvt) Ltd",
    },
    {
      year: "2024",
      event:
      "Appointed as agents for Shanghai Jin Jiang Shipping (Group) Co Ltd.",
    },
    {
      year: "2025",
      event:
      "Baksh Shipping Lines (Pvt) Ltd was formed to manage and oversee principal vessels.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-100 blur-3xl opacity-60" />
        </div>

        <div className="relative min-h-[26rem] flex items-center justify-center py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Pioneering
                <span className="mx-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  Maritime
                </span>
                Excellence
              </motion.h1>

              <motion.p
                className="mt-5 text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                A diversified group at the forefront of maritime innovation,
                logistics, and strategic investments — connecting markets with
                integrity, vision, and unmatched reliability.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
              >
                {/* <Link
                  to="/services"
                  className="px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-300 w-full sm:w-auto"
                >
                  Explore Services
                </Link> */}
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-lg bg-red text-blue-700 border border-blue-600 font-semibold hover:bg-blue-100 transition-colors duration-300 w-full sm:w-auto flex items-center gap-2"
                >
                  Get in Touch
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto hide-scrollbar">
            <div className="flex space-x-1">
              {["overview", ...companies.map((company) => company.id)].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab === "overview"
                      ? "Baksh Group"
                      : companies.find((c) => c.id === tab)?.name}
                  </button>
                )
              )}
            </div>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "overview" ? (
          <div className="space-y-16">
            {/* Group Overview */}
            <motion.section
              className="bg-white rounded-xl shadow-md p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
             <div className="flex items-center gap-1 mb-1">
               <img
                 src="/images/baksh.png"
                 alt="Baksh Group Logo"
                 className="h-24 w-24 object-contain"
               />

               <h2 className="text-3xl font-bold text-gray-900 leading-none">
                 Our Group
               </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Established in 1951 as United Oriental Steamship Co. The
                    company began by offering liner services between East
                    Pakistan (now Bangladesh) and West Pakistan (now Pakistan),
                    quickly rising to prominence as the largest ship-owning
                    company in the country.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our group of companies work in synergy to deliver end-to-end
                    solutions, from maritime transport and logistics to
                    strategic investments and financial services. We operate
                    across multiple countries with a team of dedicated
                    professionals committed to excellence.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    With independent management and specialized leadership, each
                    company within our Group operates autonomously to deliver
                    high-quality shipping and logistics solutions while
                    upholding the Group’s values of trust and excellence.
                  </p>
                  {/* <p className="text-gray-600 mb-6 leading-relaxed">
                    In 2007, a dedicated freight forwarding
division was launched under UOSL Shipping and Logistics Pvt Ltd, offering customized
logistics solutions to domestic and regional clients.
Between 2008 and 2011, two off-dock empty container depots under UOSL were
established in Karachi and Lahore Port, serving key clients.
                   </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Our group companies work in synergy to deliver end-to-end solutions, from maritime transport and logistics 
                    to strategic investments and financial services. We operate across multiple countries with a team of dedicated 
                    professionals committed to excellence.
                  </p> */}
                </div>
                <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                  <img
                    src="/images/1.jpg"
                    alt="Baksh Group"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </motion.section>
            {/* Our Mission & Vision */}
            <section
              className="relative py-16 text-white bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: "url('/images/mission.jpg')",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 via-gray-800/85 to-gray-900/35"></div>

              <div className="relative max-w-6xl mx-auto px-6 md:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white"></h2>
                  {/* <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
        Guiding our journey with innovation, integrity, and impact in every wave we sail.
      </p> */}
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Mission */}
                  <div className="group relative bg-white/10 hover:bg-white/15 transition-all duration-500 rounded-2xl shadow-2xl p-8 border border-white/10 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 bg-blue-500/30 rounded-xl group-hover:bg-blue-500/50 transition-all">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        Our Mission
                      </h3>
                    </div>
                    <p className="text-white-200 leading-relaxed">
                      Our ambition is to be recognized as the leading name in
                      the industry with the drive to meet customer objectives
                      efficiently and effectively
                    </p>
                    {/* Accent Line */}
                    <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-tr-2xl transition-all duration-500"></div>
                  </div>

                  {/* Vision */}
                  <div className="group relative bg-white/10 hover:bg-white/15 transition-all duration-500 rounded-2xl shadow-2xl p-8  border border-white/10 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 bg-blue-500/30 rounded-xl group-hover:bg-blue-500/50 transition-all">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        Our Vision
                      </h3>
                    </div>
                    <p className="text-white-200 leading-relaxed">
                      Our vision is to provide Professional and dedicated
                      quality service to all our Customers, Principals and
                      stakeholders.
                    </p>

                    {/* Accent Line */}
                    <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-tr-2xl transition-all duration-500"></div>
                  </div>
                </div>

                {/* Decorative underline */}
                <div className="mt-12 flex justify-center">
                  <div className="h-1 w-40 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg"></div>
                </div>
              </div>
            </section>

            {/* Company History */}
            {/* Timeline */}
            <section className="py-12 sm:py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Our Journey Through Time
                  </h2>
                  {/* <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              From humble beginnings in 1951 to becoming a leading maritime
              services provider in Pakistan and beyond.
            </p> */}
                </motion.div>

                <div className="relative">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
                  <div className="space-y-8 md:space-y-0">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.year}
                        className={`relative flex flex-col md:flex-row items-center md:items-start mb-8 md:mb-12 ${
                          index % 2 === 0
                            ? "md:justify-start"
                            : "md:justify-end"
                        }`}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                      >
                        <div
                          className={`w-full md:w-5/12 ${
                            index % 2 === 0
                              ? "md:text-right md:pr-8"
                              : "md:text-left md:pl-8"
                          }`}
                        >
                          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center mb-3">
                              <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                              <span className="text-xl sm:text-2xl font-bold text-primary-600">
                                {milestone.year}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                              {milestone.event}
                            </p>
                          </div>
                        </div>
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            {/* Our Values */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Our Core Values
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Integrity",
                    description:
                      "We conduct our business with honesty, transparency, and the highest ethical standards.",
                    icon: <Shield className="h-8 w-8 text-blue-600" />,
                  },
                  {
                    title: "Excellence",
                    description:
                      "We uphold the highest standards across all operations, , continuously improving and progressing",
                    icon: <Award className="h-8 w-8 text-blue-600" />,
                  },
                  {
                    title: "Customer Focus",
                    description:
                      "We build lasting relationships by understanding and exceeding our customers' expectations.",
                    icon: <Users className="h-8 w-8 text-blue-600" />,
                  },
                  {
                    title: "Innovation",
                    description:
                      "We embrace new ideas and technologies to drive progress and create value.",
                    icon: <Target className="h-8 w-8 text-blue-600" />,
                  },
                  {
                    title: "Sustainability",
                    description:
                      "Committed to protecting the environment through sustainable and responsible practices.",
                    icon: <Globe className="h-8 w-8 text-blue-600" />,
                  },
                  {
                    title: "Teamwork",
                    description:
                      "We work together by embracing different viewpoints and prioritizing diversity and inclusion to reach our objectives.",
                    icon: <Users className="h-8 w-8 text-blue-600" />,
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          // Individual Company View
          <div>
            {companies.map(
              (company) =>
                company.id === activeTab && (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.section
                      className="bg-white rounded-xl shadow-md p-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="flex items-center mb-6">
                        {company.id === "baksh-investment" && (
                          <img
                            src="/images/BSLLOGO-01.png"
                            alt="Baksh Shipping Lines Logo"
                            className="h-12 w-auto mr-4"
                          />
                        )}
                        {(company.id === "yaaseen-shipping" ||
                          company.id === "yaaseen-pvt") && (
                          <img
                            src="/images/yaseen_logo.png"
                            alt={`${company.name} Logo`}
                            className="h-12 w-auto mr-4"
                          />
                        )}
                        {company.id === "uosl" && (
                          <img
                            src="/images/uosl_logo.jpg"
                            alt="UOSL Logo"
                            className="h-12 w-auto mr-4"
                          />
                        )}
                        {company.id === "zoom" && (
                          <img
                            src="/images/zwl_logo.png"
                            alt="Zoom Logo"
                            className="h-16 w-16 mr-4"
                          />
                        )}                        
                        <h2 className="text-3xl font-bold text-gray-900">
                          {company.name}
                        </h2>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.description}
                          </p>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.id === "baksh-investment" &&
                              "In 1972, under the Government of Pakistan’s nationalization policy, the company’s fleet was acquired by the state."}
                            {company.id === "yaaseen-shipping" &&
                              "Backed by a proactive and experienced sales team, Yaaseen Shipping Lines efficiently manages both inbound and outbound shipments, maintaining a strong record of reliability and performance. The company plays an active role in freight forwarding operations solely for OOCL Pakistan and has developed a wide and diversified customer base across key export sectors including textiles, minerals, rice, garments, and cotton yarn. "}
                            {company.id === "yaaseen-pvt" &&
                              "Our team of logistics experts works closely with clients to develop customized solutions that optimize supply chain performance and reduce operational costs while maintaining the highest standards of service."}
                            {company.id === "uosl" &&
                              "In 2011, UOSL expanded its operations by establishing an Empty Container Terminal on Multan Road, Lahore, a well-known location for all customers. The terminal is ideally positioned near dry ports and key industrial areas. The Lahore facility covers 3 acres, with another 4 acres reserved for future expansion (Phase II)."}
                            {company.id === "zoom" &&
                            "The company works closely with all major exporters and importers of Pakistan, delivering reliable and customized logistics solutions across multiple industries. It focuses on efficient, cost-effective, and timely cargo movement for domestic and regional clients."}
                          </p>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.id === "baksh-investment" &&
                              "In 1978, Baksh Shipping Lines resumed operations, initiating services in stevedoring, terminal handling, and lighterage operations. The company quickly established itself as a trusted contractor for major national organizations, including the Pakistan National Shipping Corporation (PNSC), Rice Export Corporation of Pakistan, and the Trading Corporation of Pakistan."}
                            {company.id === "yaaseen-shipping" &&
                              "By combining deep industry knowledge with local market expertise, Yaaseen Shipping Lines continues to achieve consistent growth in volume and revenue, particularly through light cargo bookings and specialized logistics arrangements.  Its operational excellence is reinforced by reliable documentation, prompt communication, and close coordination with OOCL offices and customers. With a customer-centric approach, Yaaseen Shipping Lines focuses on nurturing long-term partnerships while actively expanding its clientele through superior service delivery, timely responses, and value-driven logistics solutions. "}
                            {company.id === "yaaseen-pvt" &&
                              "Established in 1981, Yaaseen Shipping Pvt Ltd began operations to represent international shipping principals in Pakistan. In 1984, the company was appointed as the exclusive agent for Orient Overseas Container Line (OOCL) and demonstrated outstanding performance throughout the years, earning a strong reputation within the industry. Building on this success, in 2006, YSL was further entrusted with agency representation for STX Pan Ocean Co Ltd (now Pan Ocean)."}
                            {company.id === "uosl" &&
                              "UOSL’s Empty Container Parks are fully equipped with all essential commercial infrastructure, including experienced and professional personnel, automated and computerized operations, and timely electronic reporting/documentation (EDI). Our competent office and field teams ensure operational efficiency and accuracy across all processes."}
                            {company.id === "zoom" &&
                            "Zoom World is supported by a highly skilled and efficient sales and operations team capable of handling all types of cargo, including perishable goods, dangerous goods (DG), oversized, and bulk shipments. The team ensures compliance with international regulations while maintaining the highest standards of safety and service quality."}
                          </p>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.id === "baksh-investment" &&
                              "The company has handled a diverse portfolio of breakbulk and containership vessels, including general cargo, project cargo, heavy lifts, and containerized shipment, ensuring adherence to international standards of safety and service quality. Its skilled workforce, modern equipment, and long-standing industry expertise has assisted in handling complete scope of work for Principal’s vessels arriving at Karachi or Port Qasim, including liaison with terminals for berth availability, arranging fuel and bunker supplies for the vessel and coordinating with the ship crew."}
                            {company.id === "yaaseen-shipping" &&
                              "Today, Yaaseen Shipping Lines stands as a trusted representative of OOCL in Pakistan, recognized for its integrity, professionalism, and unwavering commitment to quality in every aspect of its operations."}
                            {company.id === "yaaseen-pvt" &&
                              "In 2007, the company was appointed as the exclusive agent for Maldives National Shipping and, in the same year, entered into a joint venture agreement with OOCL in line with OOCL’s global JV policy. This milestone strengthened YSL’s position as a key player in Pakistan’s shipping and logistics industry, enhancing its operational capacity and service network."}
                            {company.id === "uosl" &&
                              "We maintain our clients’ trust and satisfaction through 24/7 on-site security, a dedicated backup power supply, and dual-gate access (In/Out) to ensure smooth traffic flow and faster truck turnaround. The depot also offers ample vehicle parking space for transporters."}
                            {company.id === "zoom" &&
                            "Zoom World is supported by a highly skilled and efficient sales and operations team capable of handling all types of cargo, including perishable goods, dangerous goods (DG), oversized, and bulk shipments. The team ensures compliance with international regulations while maintaining the highest standards of safety and service quality."}
                          </p>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.id === "baksh-shipping" &&
                              "Baksh Shipping Lines maintains strong relationships with port authorities, customs departments, and other key stakeholders, ensuring smooth, efficient, and compliant vessel operations."}
                            {company.id === "yaaseen-pvt" && (
                              <>
                                Over the years, Yaaseen Shipping Pvt Ltd has
                                continued to expand its partnerships and
                                currently represents several renowned global
                                shipping lines, including:
                                <ul className="list-disc list-inside mt-2">
                                  <li>W Container Lines Ltd.</li>
                                  <li>China SOC Lines</li>
                                  <li>
                                    Metro Logistics International Pvt Ltd.
                                  </li>
                                  <li>
                                    Shanghai Jin Jiang Shipping (Group) Co Ltd.
                                  </li>
                                </ul>
                              </>
                            )}
                          </p>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.id === "baksh-shipping" &&
                              "In chartering, the company provides end-to-end solutions, covering vessel chartering, voyage coordination, and cargo movement for both import and export sectors. Baksh Shipping Lines has successfully arranged vessel charters for dry bulk, breakbulk, and project cargoes, maintaining strong relationships with regional and international shipowners, charterers, and brokers."}
                            {company.id === "yaaseen-pvt" &&
                              "Through these strategic alliances, YSL has built a robust presence in both regional and global markets, offering reliable maritime and logistics solutions across a wide range of trade routes. The company’s dedicated team of professionals ensures that each client receives personalized service, timely communication, and efficient cargo handling, reinforcing YSL’s standing as a trusted and performance-driven shipping agency in Pakistan."}
                            {company.id === "uosl" &&
                              "Our key clients include OOCL, COSCO, Pan Ocean Co. Ltd, Metro Logistics International (Pvt.) Ltd, and Shanghai Jin Jiang Shipping (Group) Co. Ltd."}
                            {company.id === "zoom" &&
                            "Serving world-wide, Zoom World Pvt Ltd offers seamless supply-chain coverage across global markets, acting as a trusted logistics partner for end-to-end freight solutions. With a strong customer-centric approach, operational excellence, and global network reach, Zoom World continues to strengthen its position in the international freight forwarding industry."}
                          </p>
                          <p className="text-gray-600 mb-6 leading-relaxed">
                            {company.id === "baksh-shipping" &&
                              "Over the years, the company has evolved into a leading service provider in Pakistan’s maritime sector, offering a comprehensive range of port and vessel management services. With a legacy spanning over five decades, Baksh Shipping Lines remains committed to operational excellence, client satisfaction, and continuous innovation in Pakistan’s maritime and logistics industry."}
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg overflow-hidden h-96 md:h-full">
                          <img
                            src={
                              company.id === "baksh-investment"
                                ? "/images/bill.jpg"
                                : company.id === "yaaseen-shipping"
                                ? "/images/yal.jpg"
                                : company.id === "yaaseen-pvt"
                                ? "/images/yap.jpg"
                                : company.id === "uosl"
                                ? "/images/uosl.jpg"
                                : company.id === "zoom"
                                ? "/images/zoom.jpg"
                                : "/images/bill.jpg"
                                
                            }
                            alt={`${company.name} Operations`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </motion.section>
                  </motion.div>
                )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default About;
