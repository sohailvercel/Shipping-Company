import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Truck, Users, Anchor } from "lucide-react";
import { Link } from "react-router-dom";

const QICT: React.FC = () => {
  const features = [
    {
      label: "Location",
      value: "50 Km from Karachi City",
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: "Operator",
      value: "DP World",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      label: "Best For",
      value: "Upcountry Customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Terminal Draft",
      value: "QICT-1:12.00M  QICT-2:13.00M",
      icon: <Anchor className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Card (replaces hero) */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-6 pt-10"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium mb-2">
              PORT QASIM
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Qasim International Container Terminal
            </h1>
            <p className="text-slate-600 mt-1">
              QICT — Preferred choice for upcountry customers
            </p>
          </div>
          <img
            src="/images/qict.jpg"
            alt="Qasim International Container Terminal"
            className="w-full md:w-72 h-36 md:h-40 rounded-xl object-cover"
          />
        </div>
      </motion.section>

      {/* Vessel Schedule CTA */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="max-w-7xl mx-auto px-6 mt-6"
      >
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              CHECK VESSEL SCHEDULE
            </h2>
            <p className="text-amber-100 text-sm md:text-base">
              View real-time vessel arrivals, departures, and ETAs
            </p>
          </div>
          <a
            href="https://www.dpworld.com/en/dominicana/customer-centre/vessel-schedule"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-amber-50 transition-colors whitespace-nowrap"
          >
            View Schedule
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
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
              About QICT
            </h3>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed">
                Qasim International Container Terminal (QICT), located at Port
                Qasim approximately <strong>50 km east of Karachi city</strong>,
                is a state-of-the-art container terminal providing efficient
                cargo handling and modern logistics solutions to support
                Pakistan's international trade.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mt-4">
                QICT is generally the least preferred terminal among
                Karachi-based customers due to additional transportation costs.
                However, it remains the{" "}
                <strong>preferred choice for upcountry customers</strong> in
                Lahore, Faisalabad, and Multan, as they do not incur any extra
                handling or transportation charges.
              </p>
            </div>

            {/* Key Features */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      {item.label}
                    </div>
                    <div className="text-base font-semibold text-slate-900">
                      {item.value}
                    </div>
                  </div>
                </div>
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
                  href="https://www.dpworld.com/en/dominicana/customer-centre/vessel-schedule"
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
            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
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
                  <div className="text-3xl font-bold">5</div>
                </div>
                <div>
                  <div className="text-sm opacity-90">Loading/GC</div>
                  <div className="text-2xl font-bold">22-24</div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default QICT;
