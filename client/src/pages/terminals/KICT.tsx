import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const KICT: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Card (replaces hero) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-6 pt-10"
      >
        <motion.div
          className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-blue-500/30 to-indigo-500/30 shadow-xl"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 transition-shadow duration-300 group-hover:shadow-xl">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-2">
                WEST WHARF
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Karachi International Container Terminal
              </h1>
              <p className="text-slate-600 mt-1">
                KICT — Advanced cargo handling at Berths 28–30
              </p>
            </div>
            <img
              src="/images/kict.jpg"
              alt="Karachi International Container Terminal"
              className="w-full md:w-72 h-36 md:h-40 rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Vessel Schedule CTA */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="max-w-7xl mx-auto px-6 mt-6"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              CHECK VESSEL SCHEDULE
            </h2>
            <p className="text-blue-100 text-sm md:text-base">
              View real-time vessel arrivals, departures, and ETAs
            </p>
          </div>
          <a
            href="https://www.kictl.com/Enquiries?is=VesselSchedule"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-50 transition-all whitespace-nowrap"
          >
            View Schedule
            <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </motion.section>

      {/* Terminal Information */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              About KICT
            </h3>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed">
                Karachi International Container Terminal (KICT), located at{" "}
                <strong>Berths 28–30</strong> on the West Wharf of Karachi Port,
                is a modern and fully equipped container terminal offering
                advanced cargo handling facilities, large vessel berthing
                facilities, and efficient multimodal connectivity.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mt-4">
                KICT plays a vital role in facilitating seamless international
                trade through reliable, high-performance port operations.
              </p>
            </div>

            {/* Key Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Location", value: "Berths 28-30, West Wharf" },
                { label: "Operator", value: "Hutchison Ports" },
                { label: "Specialty", value: "Advanced Cargo Handling" },
                { label: "Connectivity", value: "Multimodal" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-md"
                >
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    {item.label}
                  </div>
                  <div className="text-base font-semibold text-slate-900">
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">
                Quick Links
              </h4>
              <div className="space-y-3">
                <a
                  href="https://www.kictl.com/Enquiries?is=VesselSchedule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">
                    Vessel Schedule
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
                <Link
                  to="/pakistan-insights#terminals"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">
                    Compare Terminals
                  </span>
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white group">
              <h4 className="text-lg font-semibold mb-4">
                Terminal Highlights
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-90">Gantry Cranes</div>
                  <div className="text-3xl font-bold">11</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Berths</div>
                  <div className="text-3xl font-bold">3</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Loading/GC</div>
                  <div className="text-2xl font-bold">20-22</div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-[radial-gradient(ellipse_at_top_left,white,transparent_60%)]" />
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default KICT;
