import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  // User,
  Lock,
  // Image,
  // Newspaper,
  Quote,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isPakistanOpen, setIsPakistanOpen] = useState(false);
  const [isTerminalsOpen, setIsTerminalsOpen] = useState(false);
  const pakistanRef = useRef<HTMLDivElement>(null);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const terminalsRef = useRef<HTMLDivElement>(null);
  // const [trackingUrl, setTrackingUrl] = useState<string>("");
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // setIsCompaniesOpen(false);
      }
      if (
        mediaRef.current &&
        !mediaRef.current.contains(event.target as Node)
      ) {
        setIsMediaOpen(false);
      }
      if (
        pakistanRef.current &&
        !pakistanRef.current.contains(event.target as Node)
      ) {
        setIsPakistanOpen(false);
        setIsTerminalsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gentle close delay to prevent accidental menu dismissals when moving cursor
  const HOVER_CLOSE_DELAY = 200; // ms
  const pakistanCloseTimer = useRef<number | null>(null);
  const terminalsCloseTimer = useRef<number | null>(null);

  const openPakistan = () => {
    if (pakistanCloseTimer.current)
      window.clearTimeout(pakistanCloseTimer.current);
    setIsPakistanOpen(true);
  };
  const scheduleClosePakistan = () => {
    if (pakistanCloseTimer.current)
      window.clearTimeout(pakistanCloseTimer.current);
    pakistanCloseTimer.current = window.setTimeout(() => {
      setIsPakistanOpen(false);
      setIsTerminalsOpen(false);
    }, HOVER_CLOSE_DELAY);
  };
  const openTerminals = () => {
    if (terminalsCloseTimer.current)
      window.clearTimeout(terminalsCloseTimer.current);
    setIsTerminalsOpen(true);
    // Ensure parent stays open while interacting with child
    openPakistan();
  };
  const scheduleCloseTerminals = () => {
    if (terminalsCloseTimer.current)
      window.clearTimeout(terminalsCloseTimer.current);
    terminalsCloseTimer.current = window.setTimeout(() => {
      setIsTerminalsOpen(false);
    }, HOVER_CLOSE_DELAY);
  };
  // // Fetch tracking URL
  // useEffect(() => {
  //   const fetchTrackingUrl = async () => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/config/tracking-url`);
  //       const result = await response.json();
  //       if (result.success && result.data.trackingUrl) {
  //         setTrackingUrl(result.data.trackingUrl);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching tracking URL:", error);
  //     }
  //   };
  //   fetchTrackingUrl();
  // }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    // setIsCompaniesOpen(false);
    setIsServicesOpen(false);
    setIsMediaOpen(false);
    setIsPakistanOpen(false);
    setIsTerminalsOpen(false);
    setIsDownloadsOpen(false);
  }, [location]);

  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  return (

    <nav className="bg-white/40 backdrop-blur-md text-gray-800 shadow-lg sticky top-0 z-50 border-b border-white/20 w-full">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* Logo */}
          <Link to="/" className="group flex items-center py-2 flex-1 z-50">
            <div className="h-12 w-full flex items-center">
              <img
                src="/images/baksh.png"
                alt="Baksh Group Logo"
                className="h-15 w-[60px] md:w-[360px] object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/about">ABOUT US</NavLink>

            {/* Companies Dropdown
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsCompaniesOpen(true)}
              onMouseLeave={() => setIsCompaniesOpen(false)}
            >
              <button className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 flex items-center">
                GROUP OF COMPANIES
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isCompaniesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isCompaniesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                  >
                    <DropdownLink
                      to="/about#overview"
                      title="Baksh Group"
                    // desc="Financial Services"
                    // img="/images/Bakhs_group.jpg"
                    />
                    <DropdownLink
                      to="/about#baksh-investment"
                      title="Baksh Shipping Lines"
                    // desc="Financial Services"
                    // img="/images/bakhs_limited.jpg"
                    />
                    <DropdownLink
                      to="/about#yaaseen-shipping"
                      title="Yaaseen Shipping Lines"
                    // desc="Global Shipping"
                    // img="/images/yaseen_logo.png"
                    />
                    <DropdownLink
                      to="/about#yaaseen-pvt"
                      title="Yaaseen Shipping Lines (Pvt) Ltd"
                    // desc="Global Shipping"
                    // img="/images/yaseen_logo.png"
                    />
                    <DropdownLink
                      to="/about#uosl"
                      title="UOSL Shipping & Logistics (Pvt) Ltd"
                    // // desc="End-to-end logistics"
                    // img="/images/uosl_logo.jpg"
                    />
                    <DropdownLink
                      to="/about#zoom"
                      title="Zoom World Pvt Ltd"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div> */}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsServicesOpen(!isServicesOpen);
                }}
                className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 flex items-center bg-transparent border-none cursor-pointer"
              >
                SERVICES
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isServicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                  >
                    <DropdownItem to="/services/1" label="Liner Agency" />
                    <DropdownItem to="/services/2" label="Freight Forwarding" />
                    <DropdownItem to="/services/3" label="Transportation" />
                    <DropdownItem to="/services/4" label="Depot Service" />
                    <DropdownItem to="/services/5" label="Vessel Handling" />
                    <DropdownItem
                      to="/services/6"
                      label="Chartering and Stevedoring"
                    />
                    <DropdownItem
                      to="/services/7"
                      label="Project Cargo Handling"
                    />
                    <DropdownItem to="/services/8" label="Ship Husbandry" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/tariffs">TARIFFS/SCHEDULE</NavLink>
            {/* Media Dropdown (Gallery + News) */}
            <div
              className="relative"
              ref={mediaRef}
              onMouseEnter={() => setIsMediaOpen(true)}
              onMouseLeave={() => setIsMediaOpen(false)}
            >
              <button className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 flex items-center">
                MEDIA
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isMediaOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isMediaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                  >
                    <DropdownItem to="/gallery" label="GALLERY" />
                    <DropdownItem to="/news" label="NEWS" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pakistan Insights Dropdown */}
            <div
              className="relative"
              ref={pakistanRef}
              onMouseEnter={openPakistan}
              onMouseLeave={scheduleClosePakistan}
            >
              <button
                type="button"
                className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsPakistanOpen((prev) => !prev);
                }}
                aria-haspopup="true"
                aria-expanded={isPakistanOpen}
              >
                PAKISTAN INSIGHTS
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isPakistanOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isPakistanOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                    onMouseEnter={openPakistan}
                    onMouseLeave={scheduleClosePakistan}
                  >
                    <DropdownItem
                      to="/pakistan-insights"
                      label="Overview"
                    />
                    {/* {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      >
                        Shipment Tracking
                      </a>
                    )} */}
                    <div className="border-t border-gray-100" />
                    <div className="relative" ref={terminalsRef}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                        onMouseEnter={openTerminals}
                        onMouseLeave={scheduleCloseTerminals}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsTerminalsOpen((prev) => !prev);
                        }}
                        aria-haspopup="true"
                        aria-expanded={isTerminalsOpen}
                      >
                        <span className="text-sm text-gray-700">Terminals</span>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-500 ${isTerminalsOpen ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isTerminalsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                            onMouseEnter={openTerminals}
                            onMouseLeave={scheduleCloseTerminals}
                          >
                            <DropdownItem
                              to="/terminals/kict"
                              label="Karachi International Container Terminal (KICT)"
                            />
                            <DropdownItem
                              to="/terminals/sapt"
                              label="South Asia Pakistan Terminal (SAPT)"
                            />
                            <DropdownItem
                              to="/terminals/kgtl"
                              label="Karachi Gateway Terminal Limited (KGTL)"
                            />
                            <DropdownItem
                              to="/terminals/qict"
                              label="Qasim International Container Terminal (QICT)"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/contact">CONTACT US</NavLink>

            {/* Downloads Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDownloadsOpen(true)}
              onMouseLeave={() => setIsDownloadsOpen(false)}
            >
              <button
                type="button"
                className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 flex items-center bg-transparent border-none cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDownloadsOpen(!isDownloadsOpen);
                }}
              >
                DOWNLOADS
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${isDownloadsOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isDownloadsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                  >
                    <DropdownItem to="/downloads/import" label="Import" />
                    <DropdownItem to="/downloads/export" label="Export" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* <NavLink to="/schedule">VESSEL SCHEDULE</NavLink> */}

            <Link
              to={isAdmin ? "/admin/dashboard" : "/login"}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Port Access"
            >
              <Lock className="w-5 h-5" />
            </Link>

            <Link
              to="/quote"
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition"
            >
              <Quote className="w-4 h-4 mr-1 inline" /> GET A QUOTE
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-white/30"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-2">
              <MobileLink to="/" label="HOME" />
              <MobileLink to="/about" label="ABOUT US" />

              {/* Mobile Companies */}
              {/* <button
                onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
                className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                GROUP OF COMPANIES
                <ChevronDown
                  className={`h-5 w-5 transition ${isCompaniesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isCompaniesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 space-y-1"
                  >
                    <MobileLink to="/about#overview" label="Baksh Group" />
                    <MobileLink
                      to="/about#baksh-investment`"
                      label="Baksh Shipping Lines"
                    />
                    <MobileLink
                      to="/about#yaaseen-shipping"
                      label="Yaaseen Shipping Lines"
                    />
                    <MobileLink
                      to="/about#yaaseen-pvt"
                      label="Yaaseen Shipping Lines (Pvt) Ltd"
                    />
                    <MobileLink
                      to="/about#uosl"
                      label="UOSL Shipping & Logistics (Pvt) Ltd"
                    />
                    <MobileLink
                      to="/about#zoom"
                      label="Zoom World Pvt Ltd"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Services */}
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                SERVICES
                <ChevronDown
                  className={`h-5 w-5 transition ${isServicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 space-y-1"
                  >
                    <MobileLink to="/services/1" label="Liner Agency" />
                    <MobileLink to="/services/2" label="Freight Forwarding" />
                    <MobileLink to="/services/3" label="Transportation" />
                    <MobileLink to="/services/4" label="Depot Services" />
                    <MobileLink to="/services/5" label="Vessel Handling" />
                    <MobileLink
                      to="/services/6"
                      label="Chartering and Stevedoring"
                    />
                    <MobileLink
                      to="/services/7"
                      label="Project Cargo Handling"
                    />
                    <MobileLink to="/services/8" label="Ship Husbandry" />
                  </motion.div>
                )}
              </AnimatePresence>
              <MobileLink to="/tariffs" label="TARIFFS & SCHEDULES" />
              {/* Mobile MEDIA accordion */}
              <button
                onClick={() => setIsMediaOpen(!isMediaOpen)}
                className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                MEDIA
                <ChevronDown
                  className={`h-5 w-5 transition ${isMediaOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isMediaOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pl-6 space-y-1"
                  >
                    <MobileLink to="/gallery" label="GALLERY" />
                    <MobileLink to="/news" label="NEWS" />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Mobile Pakistan Insights accordion */}
              <button
                onClick={() => setIsPakistanOpen(!isPakistanOpen)}
                className="flex justify-between items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                PAKISTAN INSIGHTS
                <ChevronDown
                  className={`h-5 w-5 transition ${isPakistanOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <AnimatePresence>
                {isPakistanOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pl-6 space-y-1"
                  >
                    <MobileLink
                      to="/pakistan-insights/our-pakistan"
                      label="Overview"
                    />
                    {/* {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-blue-50 rounded-lg"
                      >
                        Shipment Tracking
                      </a>
                    )} */}
                    <button
                      onClick={() => setIsTerminalsOpen(!isTerminalsOpen)}
                      className="flex justify-between items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 rounded-lg"
                    >
                      Terminals
                      <ChevronDown
                        className={`h-4 w-4 transition ${isTerminalsOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isTerminalsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.12 }}
                          className="pl-4 space-y-1"
                        >
                          <MobileLink
                            to="/pakistan-insights/terminals/kict"
                            label="KICT"
                          />
                          <MobileLink
                            to="/pakistan-insights/terminals/sapt"
                            label="SAPT"
                          />
                          <MobileLink
                            to="/pakistan-insights/terminals/kgtl"
                            label="KGTL"
                          />
                          <MobileLink
                            to="/pakistan-insights/terminals/qict"
                            label="QICT"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
              <MobileLink to="/contact" label="CONTACT US" />
              <MobileLink to="/downloads" label="DOWNLOADS" />
              {/* <MobileLink to="/schedule" label="VESSEL SCHEDULE" /> */}

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100/50">
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/login"}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Lock className="w-5 h-5" />
                </Link>
                <Link
                  to="/quote"
                  className="flex-1 text-center px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"
                >
                  GET A QUOTE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Helper Components
const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white/30 rounded-lg flex items-center"
  >
    {children}
  </Link>
);

const DropdownLink = ({
  to,
  title,
}: // desc,
  // img,
  {
    to: string;
    title: string;
    // desc: string;
    // img: string;
  }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-3 hover:bg-blue-50 transition"
  >
    {/* <img src={img} alt={title} className="w-8 h-8 rounded-md mr-3" /> */}
    <div className="flex-1">
      <div className="font-medium">{title}</div>
      {/* <div className="text-xs text-gray-500">{desc}</div> */}
    </div>
  </Link>
);

const DropdownItem = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
  >
    {label}
  </Link>
);

const MobileLink = ({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon?: React.ReactNode;
}) => (
  <Link
    to={to}
    className="flex items-center px-4 py-3 text-base text-gray-700 hover:bg-blue-50 rounded-lg"
  >
    {icon && <span className="mr-3">{icon}</span>}
    {label}
  </Link>
);

export default Navigation;
