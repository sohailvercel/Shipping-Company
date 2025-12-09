import React, { useCallback, useMemo, useState, useEffect } from "react";
// import { motion } from "framer-motion";
import {
  // FileText,
  // Calendar,
  // Plus,
  LogOut,
  // Image as ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { getEffectiveRate } from "../lib/exchangeRates";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // const dashboardItems = [
  //   {
  //     title: "Vessel Schedules",
  //     link: "/admin/schedules",
  //     color: "from-orange-500 to-orange-600",
  //   },
  // ];

  // const quickActions = [
  //   {
  //     title: "Create Schedule",
  //     description: "Create a new vessel schedule",
  //     icon: <Plus className="w-5 h-5" />,
  //     action: () => navigate("/admin/schedules?action=add"),
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exchange Rate History Widget */}
        <ExchangeRateWidget />

        {/* Quick Stats
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"> */}
        {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gallery Images</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </motion.div> */}
        {/* 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </motion.div> */}

        {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Vessel Schedules
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </motion.div> */}
        {/* </div> */}

        {/* Management Sections */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {dashboardItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={item.link} className="block">
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div
                      className={`p-3 bg-gradient-to-r ${item.color} rounded-lg text-white`}
                    >
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div> */}

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={action.action}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    {action.icon}
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 group-hover:text-blue-700">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default AdminDashboard;

// --- Local widget component for historical exchange rates ---
const ExchangeRateWidget: React.FC = () => {
  const { user } = useAuth();
  if (user?.role !== "admin") return null; // widget only visible to admins

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState<string>(todayStr);
  const [fetchedRate, setFetchedRate] = useState<number | null>(null);
  const [sourceDate, setSourceDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allowUsers, setAllowUsers] = useState<boolean>(false);
  const [toggling, setToggling] = useState<boolean>(false);

  useEffect(() => {
    // fetch current tariff page to read allowUserHistoricalRates
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/tariffPage");
        if (mounted && res.data?.success && res.data.data) {
          setAllowUsers(Boolean(res.data.data.allowUserHistoricalRates));
        }
      } catch (e) {
        // ignore silently
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchRate = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setFetchedRate(null);
    setSourceDate(null);
    try {
      const effective = await getEffectiveRate(date);
      if (effective) {
        setFetchedRate(effective.rate);
        setSourceDate(effective.sourceDate);
      } else {
        toast("No saved rate on or before this date", { icon: "ℹ️" });
      }
    } catch (e: any) {
      console.error("Fetch effective exchange rate failed", e);
      toast.error(e?.message || "Failed to fetch rate");
    } finally {
      setLoading(false);
    }
  }, [date]);

  return (
    <section className="mb-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Exchange Rate by Date
          </h2>
          <div className="text-sm text-gray-500">UTC dates (YYYY-MM-DD)</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchRate}
              disabled={loading}
              className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "Fetching…" : "Fetch Saved"}
            </button>
            <div className="flex items-center gap-2 ml-2">
              <label className="text-sm">
                Allow users to fetch historical rates
              </label>
              <button
                onClick={async () => {
                  setToggling(true);
                  try {
                    const next = !allowUsers;
                    await axios.put("/tariffPage", {
                      allowUserHistoricalRates: next,
                    });
                    setAllowUsers(next);
                    toast.success(
                      `Historical rates for users ${
                        next ? "enabled" : "disabled"
                      }`
                    );
                  } catch (e: any) {
                    console.error(
                      "Failed to toggle allowUserHistoricalRates",
                      e
                    );
                    toast.error("Failed to update setting");
                  } finally {
                    setToggling(false);
                  }
                }}
                disabled={toggling}
                className={`px-3 py-1 rounded-lg font-medium ${
                  allowUsers
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {toggling ? "Saving…" : allowUsers ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-700">
          {fetchedRate !== null ? (
            <span>
              1 USD = <strong>{fetchedRate.toFixed(2)}</strong> PKR
              {sourceDate && (
                <span className="text-gray-500">
                  {" "}
                  (last updated on {sourceDate})
                </span>
              )}
            </span>
          ) : (
            <span>No saved rate on or before {date}.</span>
          )}
        </div>
      </div>
    </section>
  );
};
