import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Ship, MapPin, Calendar } from "lucide-react";
// import { pageBackgrounds } from '../assets/videos';

// Note: Inline typing is used in sample data; remove unused Voyage interface

const Schedule: React.FC = () => {
  const [expandedVessel, setExpandedVessel] = useState<number | null>(null);

  const toggleVessel = (id: number) => {
    setExpandedVessel(expandedVessel === id ? null : id);
  };

  // Sample vessel data
  const vessels = [
    {
      id: 1,
      name: "MV Sea Breeze",
      type: "Container Ship",
      capacity: "8,000 TEU",
      flag: "Panama",
      currentLocation: "At Sea",
      voyages: [
        {
          id: 1,
          voyageNumber: "VY1234",
          origin: "Shanghai",
          destination: "Rotterdam",
          departure: "2025-10-01",
          arrival: "2025-11-10",
          status: "On Time" as const,
          schedule: [
            {
              port: "Shanghai",
              arrival: "2025-10-01 08:00",
              departure: "2025-10-02 18:00",
              status: "Completed" as const,
            },
            {
              port: "Singapore",
              arrival: "2025-10-06 12:00",
              departure: "2025-10-07 12:00",
              status: "In Progress" as const,
            },
            {
              port: "Colombo",
              arrival: "2025-10-12 08:00",
              departure: "2025-10-13 20:00",
              status: "Upcoming" as const,
            },
            {
              port: "Suez Canal",
              arrival: "2025-10-20 06:00",
              departure: "2025-10-21 06:00",
              status: "Upcoming" as const,
            },
            {
              port: "Rotterdam",
              arrival: "2025-11-10 14:00",
              departure: "2025-11-12 10:00",
              status: "Upcoming" as const,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "MV Ocean Voyager",
      type: "Bulk Carrier",
      capacity: "180,000 DWT",
      flag: "Liberia",
      currentLocation: "Port of Singapore",
      voyages: [
        {
          id: 2,
          voyageNumber: "VY2345",
          origin: "Perth",
          destination: "Qingdao",
          departure: "2025-09-25",
          arrival: "2025-10-15",
          status: "On Time" as const,
          schedule: [
            {
              port: "Perth",
              arrival: "2025-09-25 10:00",
              departure: "2025-09-26 18:00",
              status: "Completed" as const,
            },
            {
              port: "Singapore",
              arrival: "2025-10-02 08:00",
              departure: "2025-10-04 08:00",
              status: "In Progress" as const,
            },
            {
              port: "Qingdao",
              arrival: "2025-10-15 14:00",
              departure: "2025-10-18 10:00",
              status: "Upcoming" as const,
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "MV Star Horizon",
      type: "Container Ship",
      capacity: "14,000 TEU",
      flag: "Marshall Islands",
      currentLocation: "At Sea",
      voyages: [
        {
          id: 3,
          voyageNumber: "VY3456",
          origin: "Rotterdam",
          destination: "New York",
          departure: "2025-09-28",
          arrival: "2025-10-20",
          status: "Delayed" as const,
          schedule: [
            {
              port: "Rotterdam",
              arrival: "2025-09-28 08:00",
              departure: "2025-09-29 20:00",
              status: "Completed" as const,
            },
            {
              port: "Southampton",
              arrival: "2025-09-30 12:00",
              departure: "2025-10-01 12:00",
              status: "Completed" as const,
            },
            {
              port: "New York",
              arrival: "2025-10-20 08:00",
              departure: "2025-10-22 18:00",
              status: "Upcoming" as const,
            },
          ],
        },
      ],
    },
  ];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusColors = {
      "On Time": "bg-green-100 text-green-800",
      Delayed: "bg-yellow-100 text-yellow-800",
      Completed: "bg-blue-100 text-blue-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Upcoming: "bg-gray-100 text-gray-800",
    } as const;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Title */}
      <div className="text-center py-12">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Vessel Schedule
        </motion.h1>
        <div className="mt-2 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search vessels
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Search vessels..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="vessel-type" className="sr-only">
                  Vessel Type
                </label>
                <select
                  id="vessel-type"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue=""
                >
                  <option value="">All Vessel Types</option>
                  <option value="container">Container Ships</option>
                  <option value="bulk">Bulk Carriers</option>
                  <option value="tanker">Tankers</option>
                </select>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 11-2 0V4H5v2a1 1 0 01-2 0V3zm2 7a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1zm4 4a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Vessels List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {vessels.map((vessel) => (
              <li key={vessel.id} className="hover:bg-gray-50">
                <div
                  className="px-4 py-4 sm:px-6 cursor-pointer"
                  onClick={() => toggleVessel(vessel.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Ship className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vessel.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vessel.type} • {vessel.capacity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm text-gray-500 mr-4">
                        <span className="font-medium">Current Location:</span>{" "}
                        {vessel.currentLocation}
                      </div>
                      <div className="flex-shrink-0">
                        {expandedVessel === vessel.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voyage Details - Collapsible */}
                {expandedVessel === vessel.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 bg-gray-50"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      {vessel.voyages.map((voyage) => (
                        <div key={voyage.id} className="mb-8">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                Voyage: {voyage.voyageNumber}
                              </h3>
                              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {voyage.origin} → {voyage.destination}
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {new Date(
                                    voyage.departure
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    voyage.arrival
                                  ).toLocaleDateString()}
                                </div>
                                <div className="mt-2 flex items-center">
                                  <StatusBadge status={voyage.status} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Schedule Timeline */}
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-4">
                              PORT SCHEDULE
                            </h4>
                            <div className="overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Port
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Arrival (Local)
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Departure (Local)
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {voyage.schedule.map((stop, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                              {stop.port}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {new Date(
                                            stop.arrival
                                          ).toLocaleString()}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {new Date(
                                            stop.departure
                                          ).toLocaleString()}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={stop.status} />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Pagination */}
        <nav
          className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-8"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">3</span> of{" "}
              <span className="font-medium">12</span> vessels
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
};

export default Schedule;
