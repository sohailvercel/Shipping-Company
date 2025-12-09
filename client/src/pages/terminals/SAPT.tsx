import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const SAPT: React.FC = () => {
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
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden"
        >
          {/* subtle animated gradient sheen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(115deg, rgba(124,58,237,0.08), rgba(255,255,255,0) 60%)",
            }}
          />
          <div className="flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-medium mb-2">
              KARACHI CITY
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              South Asia Pakistan Terminal
            </h1>
            <p className="text-slate-600 mt-1">
              SAPT — Pakistan's first deep-water container terminal
            </p>
          </div>
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            src="/images/sapt.jpg"
            alt="South Asia Pakistan Terminal"
            className="w-full md:w-72 h-36 md:h-40 rounded-xl object-cover shadow-sm"
          />
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
          whileTap={{ scale: 0.995 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              CHECK VESSEL SCHEDULE
            </h2>
            <p className="text-violet-100 text-sm md:text-base">
              View real-time vessel arrivals, departures, and ETAs
            </p>
          </div>
          <motion.a
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="https://www.sapt.com.pk/enquiries?is=VesselSchedule"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-violet-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-violet-50 transition-colors whitespace-nowrap"
          >
            View Schedule
            <ExternalLink className="w-5 h-5" />
          </motion.a>
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
              About SAPT
            </h3>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed">
                South Asia Pakistan Terminals (SAPT), situated at Karachi Port,
                is{" "}
                <strong>Pakistan's first deep-water container terminal</strong>,
                developed to accommodate the world's largest container vessels.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mt-4">
                The terminal features{" "}
                <strong>world-class infrastructure</strong>, deep-draft berths,
                and high-capacity cranes, enabling efficient, high-volume cargo
                handling and setting new benchmarks for productivity and
                operational excellence in Pakistan's maritime industry.
              </p>
            </div>

            {/* Key Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Location", value: "Karachi City" },
                { label: "Operator", value: "Hutchison Ports" },
                { label: "Specialty", value: "Deep-Water Terminal" },
                { label: "Draft", value: "16 M Permissible" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
            <motion.div
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl shadow-lg p-6 transition-shadow"
            >
              <h4 className="text-lg font-semibold text-slate-900 mb-4">
                Quick Links
              </h4>
              <div className="space-y-3">
                <a
                  href="https://www.sapt.com.pk/enquiries?is=VesselSchedule"
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
            </motion.div>

            {/* Stats Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 1.2 }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 70%)",
                }}
              />
              <h4 className="text-lg font-semibold mb-4">
                Terminal Highlights
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-90">Gantry Cranes</div>
                  <div className="text-3xl font-bold">14</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Berths</div>
                  <div className="text-3xl font-bold">4</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Loading/GC</div>
                  <div className="text-2xl font-bold">20-24</div>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default SAPT;
