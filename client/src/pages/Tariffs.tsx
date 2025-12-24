import React, { useState, useEffect, useRef } from "react";
import { getEffectiveRate, getEffectiveRatePublic } from "../lib/exchangeRates";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import EditableTable from "../components/EditableTable";
import { TariffPageData, TariffTable, CompanyTariff } from "../types/tariff";
import {
  Clock
} from 'lucide-react';
const Tariffs: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(282.5);
  const [isSaving, setIsSaving] = useState(false);
  // Unified exchange editing (rate + date)
  const [isEditingExchange, setIsEditingExchange] = useState(false);
  const [tempExchangeRate, setTempExchangeRate] = useState(282.5);
  const [exchangeDate, setExchangeDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [tempExchangeDate, setTempExchangeDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // UI for non-admin users to pick a date and view historical exchange rate
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userPickerDate, setUserPickerDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [userFetchedRate, setUserFetchedRate] = useState<number | null>(null);
  const [userFetchedSource, setUserFetchedSource] = useState<string | null>(
    null
  );
  const [userPickerLoading, setUserPickerLoading] = useState(false);
  const [scheduleFile, setScheduleFile] = useState<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    updatedAt: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tariffData, setTariffData] = useState<TariffPageData | null>(null);
  const [editableData, setEditableData] = useState<TariffPageData | null>(null);
  const [editingTable, setEditingTable] = useState<{
    companyIndex: number;
    tableIndex: number;
  } | null>(null);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [deleteCompanyIndex, setDeleteCompanyIndex] = useState<number | "">("");
  const [showConfirmDeleteCompany, setShowConfirmDeleteCompany] =
    useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  // Per-company controls
  const [addTableTitleByCompany, setAddTableTitleByCompany] = useState<
    Record<number, string>
  >({});
  const [deleteTableIndexByCompany, setDeleteTableIndexByCompany] = useState<
    Record<number, number | "">
  >({});
  const [showConfirmDeleteTable, setShowConfirmDeleteTable] = useState<null | {
    companyIndex: number;
    tableIndex: number;
  }>(null);
  const [editingCompanyNameIndex, setEditingCompanyNameIndex] = useState<
    number | null
  >(null);
  const [tempCompanyName, setTempCompanyName] = useState<string>("");

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
  }, [user]);

  useEffect(() => {
    const fetchTariffData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/tariffPage");
        if (response.data.success) {
          const data: TariffPageData = response.data.data;
          setTariffData(data);
          setEditableData(data);
          setExchangeRate(data.exchangeRate);
          setExchangeDate(data.exchangeDate);
          setTempExchangeRate(data.exchangeRate);
          setTempExchangeDate(data.exchangeDate);
        }
      } catch (err: any) {
        // Gracefully handle 404 (no document yet): initialize empty state so Admin can start editing
        const status = err?.response?.status;
        if (status === 404) {
          const empty: TariffPageData = {
            exchangeRate: 1,
            exchangeDate: new Date().toISOString().slice(0, 10),
            companies: [],
          };
          setTariffData(empty);
          setEditableData(empty);
          setExchangeRate(empty.exchangeRate);
          setExchangeDate(empty.exchangeDate);
          setTempExchangeRate(empty.exchangeRate);
          setTempExchangeDate(empty.exchangeDate);
        } else {
          console.error("Failed to fetch tariff data:", err);
          setError("Failed to load tariff data");
          toast.error("Failed to load tariff data");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchScheduleFile = async () => {
      try {
        const response = await axios.get("/schedule-file");
        if (response.data.success) {
          setScheduleFile(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch schedule file:", err);
      }
    };

    fetchTariffData();
    fetchScheduleFile();
  }, []);

  // Unified exchange editing handlers
  const handleStartEditExchange = () => {
    if (!isAdmin) return;
    setTempExchangeRate(exchangeRate);
    setTempExchangeDate(exchangeDate);
    setIsEditingExchange(true);
  };

  const handleSaveExchange = async () => {
    if (
      !isAdmin ||
      isNaN(tempExchangeRate) ||
      tempExchangeRate <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(tempExchangeDate)
    )
      return;
    setIsSaving(true);
    try {
      const response = await axios.patch("/tariffPage/exchange", {
        exchangeRate: tempExchangeRate,
        exchangeDate: tempExchangeDate,
      });
      if (response.data.success) {
        const updatedData: TariffPageData = response.data.data;
        setTariffData(updatedData);
        setEditableData(updatedData);
        setExchangeRate(updatedData.exchangeRate);
        setExchangeDate(updatedData.exchangeDate);
        setIsEditingExchange(false);
        toast.success("Exchange updated successfully");
      }
    } catch (err) {
      console.error("Failed to update exchange:", err);
      toast.error("Failed to update exchange");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelExchange = () => {
    setIsEditingExchange(false);
    setTempExchangeRate(exchangeRate);
    setTempExchangeDate(exchangeDate);
  };

  const handleEditTable = (companyIndex: number, tableIndex: number) => {
    setEditingTable({ companyIndex, tableIndex });
  };

  const handleCancelEdit = () => {
    setEditingTable(null);
    setEditableData(tariffData);
  };

  const handleDownloadSchedule = () => {
    if (!scheduleFile) return;
    const link = document.createElement("a");
    link.href = scheduleFile.fileUrl;
    link.download = scheduleFile.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSchedule = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsSaving(true);
    try {
      const response = await axios.post("/schedule-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setScheduleFile(response.data.data);
        toast.success("Schedule uploaded successfully");
      }
    } catch (err: any) {
      console.error("Failed to upload schedule:", err);
      toast.error(err.response?.data?.error || "Failed to upload schedule");
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSaveTable = async () => {
    if (!editableData || !isAdmin) return;
    setIsSaving(true);
    try {
      const response = await axios.put("/tariffPage", editableData);
      if (response.data.success) {
        setTariffData(response.data.data);
        setEditingTable(null);
        toast.success("Table updated successfully");
      }
    } catch (err) {
      console.error("Failed to save table:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Generic save-all helper (PUT entire document)
  const saveAll = async (doc: TariffPageData, successMsg = "Saved") => {
    setIsSaving(true);
    try {
      const response = await axios.put("/tariffPage", doc);
      if (response.data.success) {
        const updated: TariffPageData = response.data.data;
        setTariffData(updated);
        setEditableData(updated);
        toast.success(successMsg);
      }
    } catch (err) {
      console.error("Failed to save tariff page:", err);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Add company
  const handleAddCompany = async () => {
    if (!isAdmin || !editableData) return;
    const name = newCompanyName.trim();
    if (!name) {
      toast.error("Please enter a company name");
      return;
    }
    // Optional: prevent duplicates
    if (
      editableData.companies.some(
        (c) => (c.name || "").toLowerCase() === name.toLowerCase()
      )
    ) {
      toast.error("A company with this name already exists");
      return;
    }
    const newCompany: CompanyTariff = { name, tables: [] } as CompanyTariff;
    const next: TariffPageData = {
      ...editableData,
      companies: [...editableData.companies, newCompany],
    };
    await saveAll(next, "Company added");
    setNewCompanyName("");
  };

  // Delete company
  const handleDeleteCompany = async () => {
    if (!isAdmin || !editableData) return;
    if (deleteCompanyIndex === "") {
      toast.error("Please select a company to delete");
      return;
    }
    const idx = Number(deleteCompanyIndex);
    if (isNaN(idx) || idx < 0 || idx >= editableData.companies.length) return;
    // Open in-app confirmation modal instead of browser confirm
    setCompanyToDelete(idx);
    setShowConfirmDeleteCompany(true);
  };

  const handleUpdateTable = (
    companyIndex: number,
    tableIndex: number,
    updatedTable: TariffTable
  ) => {
    if (!editableData) return;
    const company = editableData.companies[companyIndex];
    if (!company) return;
    const newData: TariffPageData = {
      ...editableData,
      companies: [...editableData.companies],
    };
    newData.companies[companyIndex] = {
      ...company,
      tables: [...company.tables],
    };
    newData.companies[companyIndex].tables[tableIndex] = { ...updatedTable };
    setEditableData(newData);
  };

  // Company-level actions
  const handleAddTable = async (companyIndex: number) => {
    if (!isAdmin || !editableData) return;
    const title =
      (addTableTitleByCompany[companyIndex] || "").trim() || "New Table";
    const next: TariffPageData = {
      ...editableData,
      companies: editableData.companies.map((c, i) =>
        i === companyIndex
          ? {
            ...c,
            tables: [...(c.tables || []), { title, columns: [], rows: [] }],
          }
          : c
      ),
    };
    await saveAll(next, "Table added");
    setAddTableTitleByCompany((prev) => ({ ...prev, [companyIndex]: "" }));
  };

  const handleDeleteTable = async (companyIndex: number) => {
    if (!isAdmin || !editableData) return;
    const sel = deleteTableIndexByCompany[companyIndex];
    if (sel === "" || sel === undefined) {
      toast.error("Please select a table to delete");
      return;
    }
    const idx = Number(sel);
    const company = editableData.companies[companyIndex];
    if (
      !company ||
      isNaN(idx) ||
      idx < 0 ||
      idx >= (company.tables?.length || 0)
    )
      return;
    // Show in-app confirmation modal instead of browser confirm
    setShowConfirmDeleteTable({ companyIndex, tableIndex: idx });
  };

  // Perform delete after user confirms (company)
  const performDeleteCompany = async () => {
    if (!isAdmin || !editableData || companyToDelete === null) return;
    const idx = companyToDelete;
    const next: TariffPageData = {
      ...editableData,
      companies: editableData.companies.filter((_, i) => i !== idx),
    };
    setShowConfirmDeleteCompany(false);
    setCompanyToDelete(null);
    await saveAll(next, "Company deleted");
    setDeleteCompanyIndex("");
  };

  // Perform delete after user confirms (table)
  const performDeleteTable = async () => {
    if (!isAdmin || !editableData || !showConfirmDeleteTable) return;
    const { companyIndex, tableIndex } = showConfirmDeleteTable;
    const next: TariffPageData = {
      ...editableData,
      companies: editableData.companies.map((c, i) =>
        i === companyIndex
          ? {
            ...c,
            tables: (c.tables || []).filter((_, ti) => ti !== tableIndex),
          }
          : c
      ),
    };
    setShowConfirmDeleteTable(null);
    await saveAll(next, "Table deleted");
    setDeleteTableIndexByCompany((prev) => ({ ...prev, [companyIndex]: "" }));
  };

  const startEditCompanyName = (companyIndex: number) => {
    if (!isAdmin || !editableData) return;
    const name = editableData.companies[companyIndex]?.name || "";
    setEditingCompanyNameIndex(companyIndex);
    setTempCompanyName(name);
  };

  const saveCompanyName = async (companyIndex: number) => {
    if (!isAdmin || !editableData) return;
    const name = tempCompanyName.trim();
    if (!name) {
      toast.error("Company name cannot be empty");
      return;
    }
    const next: TariffPageData = {
      ...editableData,
      companies: editableData.companies.map((c, i) =>
        i === companyIndex ? { ...c, name } : c
      ),
    };
    await saveAll(next, "Company name updated");
    setEditingCompanyNameIndex(null);
    setTempCompanyName("");
  };

  const cancelCompanyName = () => {
    setEditingCompanyNameIndex(null);
    setTempCompanyName("");
  };

  const isTableEditing = (companyIndex: number, tableIndex: number) =>
    !!editingTable &&
    editingTable.companyIndex === companyIndex &&
    editingTable.tableIndex === tableIndex;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tariff data...</p>
        </div>
      </div>
    );
  }

  if (error || !tariffData || !editableData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Failed to load tariff data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-8">
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 rounded-r-lg shadow-lg p-4"
        >
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-amber-600 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                <strong>Admin Mode:</strong> You can edit the exchange rate and
                table contents.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {(isAdmin || tariffData?.allowUserHistoricalRates) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-4 shadow-2xl rounded-lg mb-8 max-w-6xl mx-auto"
        >
          <div className="px-6">
            {/* Unified exchange ribbon (cleaned, balanced JSX) */}
            {!isEditingExchange ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                <div className="flex items-start space-x-4">
                  {/* calendar control (functional) or spacer */}
                  {isAdmin || tariffData?.allowUserHistoricalRates ? (
                    <button
                      onClick={() => setShowUserPicker((s) => !s)}
                      className="bg-white/10 p-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center"
                      title={
                        isAdmin
                          ? "Pick date / admin fetch"
                          : "Pick date to view historical rate"
                      }
                    >
                      <svg
                        className="w-6 h-6 text-yellow-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  ) : (
                    <div
                      aria-hidden
                      className="bg-white/10 p-2 rounded-lg backdrop-blur-sm transition-colors flex items-center justify-center"
                      title="Historical rates (admin-only)"
                    >
                      <svg
                        className="w-6 h-6 text-yellow-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-xs text-blue-200 block">
                          Today
                        </span>
                        <span className="font-semibold text-lg block">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="text-xs text-blue-100/80 mt-1">
                          Saved on: {exchangeDate}
                        </div>
                      )}
                    </div>

                    {showUserPicker &&
                      (isAdmin || tariffData?.allowUserHistoricalRates) && (
                        <div className="mt-3 bg-white/5 p-3 rounded-lg border border-white/10">
                          <div className="flex items-center gap-3">
                            <input
                              type="date"
                              value={userPickerDate}
                              onChange={(e) =>
                                setUserPickerDate(e.target.value)
                              }
                              className="px-3 py-2 rounded-lg text-gray-900"
                            />
                            <button
                              onClick={async () => {
                                setUserPickerLoading(true);
                                setUserFetchedRate(null);
                                setUserFetchedSource(null);
                                try {
                                  const res = isAdmin
                                    ? await getEffectiveRate(userPickerDate)
                                    : await getEffectiveRatePublic(
                                      userPickerDate
                                    );
                                  if (res) {
                                    setUserFetchedRate(res.rate);
                                    setUserFetchedSource(res.sourceDate);
                                  } else {
                                    setUserFetchedRate(null);
                                    setUserFetchedSource(null);
                                    toast(
                                      "No saved rate on or before this date",
                                      { icon: "ℹ️" }
                                    );
                                  }
                                } catch (err: any) {
                                  toast.error(
                                    err?.message || "Failed to fetch rate"
                                  );
                                } finally {
                                  setUserPickerLoading(false);
                                }
                              }}
                              disabled={userPickerLoading}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                            >
                              {userPickerLoading ? "Fetching…" : "Fetch"}
                            </button>
                            <button
                              onClick={() => setShowUserPicker(false)}
                              className="px-3 py-2 bg-gray-300 rounded-lg"
                            >
                              Close
                            </button>
                          </div>

                          <div className="mt-3 text-sm text-white">
                            {userFetchedRate !== null ? (
                              <div>
                                1 USD ={" "}
                                <strong>{userFetchedRate.toFixed(2)}</strong>{" "}
                                PKR
                                {userFetchedSource && (
                                  <span className="text-gray-200">
                                    {" "}
                                    (last updated on {userFetchedSource})
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-200">
                                Select a date and fetch the saved rate.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-800/50 to-indigo-900/50 px-5 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-white/10">
                  <span className="text-blue-200 text-sm">Exchange Rate:</span>
                  <span className="font-bold text-xl text-yellow-300 drop-shadow-lg">
                    1 USD = {exchangeRate.toFixed(2)} PKR
                  </span>
                  {isAdmin && (
                    <button
                      onClick={handleStartEditExchange}
                      disabled={isSaving}
                      className="ml-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      title="Edit Exchange"
                    >
                      ✏️ Edit Exchange
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <div className="flex items-center space-x-2">
                  <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-yellow-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-200 mb-1">
                      Effective Date
                    </span>
                    <input
                      type="date"
                      value={tempExchangeDate}
                      onChange={(e) => setTempExchangeDate(e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border-2 border-blue-300 text-gray-900 focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-800/50 to-indigo-900/50 px-4 py-3 rounded-xl border border-white/10">
                  <span className="text-blue-200 text-sm">Exchange Rate:</span>
                  <span className="text-yellow-300 font-medium">1 USD =</span>
                  <input
                    type="number"
                    value={tempExchangeRate}
                    onChange={(e) =>
                      setTempExchangeRate(parseFloat(e.target.value) || 0)
                    }
                    className="w-28 px-3 py-2 text-sm rounded-lg border-2 border-blue-300 text-gray-900 focus:ring-2 focus:ring-yellow-400"
                    step="0.01"
                    min="0"
                    autoFocus
                  />
                  <span className="text-yellow-300 font-medium">PKR</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveExchange}
                    disabled={
                      isSaving ||
                      isNaN(tempExchangeRate) ||
                      tempExchangeRate <= 0 ||
                      !/^\d{4}-\d{2}-\d{2}$/.test(tempExchangeDate)
                    }
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                    title="Save Exchange"
                  >
                    {isSaving ? "⏳ Saving..." : "✓ Save"}
                  </button>
                  <button
                    onClick={handleCancelExchange}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                    title="Cancel"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Schedule Section Heading */}
      {(isAdmin || scheduleFile) && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-6 px-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Vessel Schedule</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500 ml-4.5">Download our latest shipping schedules and port arrival information.</p>
        </motion.div>
      )}

      {/* Schedule Bar */}
      {(isAdmin || scheduleFile) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-b-4 border-b-blue-600 shadow-2xl rounded-2xl mb-16 max-w-6xl mx-auto overflow-hidden group hover:shadow-blue-100/50 transition-shadow duration-500"
        >
          <div className="flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 gap-6 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {scheduleFile && (
                  <div className="absolute -top-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {scheduleFile ? scheduleFile.fileName : "No schedule available"}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    Updated: {scheduleFile ? new Date(scheduleFile.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "--"}
                  </span>
                  {scheduleFile && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {scheduleFile.fileType.split('/')[1]?.toUpperCase() || 'DOC'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {scheduleFile && (
                <button
                  onClick={handleDownloadSchedule}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Schedule
                </button>
              )}

              {isAdmin && (
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadSchedule}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <button
                    onClick={triggerFileInput}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white border-2 border-amber-400 text-amber-600 hover:bg-amber-50 text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {isSaving ? "Uploading..." : scheduleFile ? "Change File" : "Upload Schedule"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto pb-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight mb-3 drop-shadow-sm">
              Tariffs
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
              <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
              <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
            </div>
          </motion.div>
        </div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10 p-6 bg-white border-2 border-blue-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-800">
                Company Management
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Add company */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-green-600">➕</span> Add Company
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Company title"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    disabled={isSaving}
                  />
                  <button
                    onClick={handleAddCompany}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    ➕ Add
                  </button>
                </div>
                {/* Stylish preview of title */}
                {newCompanyName.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <span className="text-xs text-blue-600 font-medium">
                      Preview:{" "}
                    </span>
                    <span className="text-sm font-bold text-blue-800">
                      {newCompanyName.trim()}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Delete company */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-red-600">🗑️</span> Delete Company
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={deleteCompanyIndex}
                    onChange={(e) =>
                      setDeleteCompanyIndex(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm cursor-pointer"
                    disabled={isSaving || editableData.companies.length === 0}
                  >
                    <option value="">
                      {editableData.companies.length
                        ? "Select company"
                        : "No companies"}
                    </option>
                    {editableData.companies.map((c, i) => (
                      <option key={i} value={i}>
                        {c.name || `Company ${i + 1}`}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleDeleteCompany}
                    disabled={isSaving || deleteCompanyIndex === ""}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    🗑️ Delete
                  </button>
                </div>
                {deleteCompanyIndex !== "" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1"
                  >
                    <span>⚠️</span> This will permanently remove the company and
                    all its tables.
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-16">
          {editableData.companies && editableData.companies.length > 0 ? (
            editableData.companies.map((company, companyIndex) => (
              <motion.div
                key={companyIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: companyIndex * 0.1 }}
                className="space-y-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-gradient-to-r from-blue-500 to-purple-500">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {editingCompanyNameIndex === companyIndex ? (
                        <input
                          type="text"
                          value={tempCompanyName}
                          onChange={(e) => setTempCompanyName(e.target.value)}
                          className="px-3 py-2 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-800"
                          autoFocus
                        />
                      ) : (
                        company.name || `Company ${companyIndex + 1}`
                      )}
                    </h2>
                  </div>
                  {isAdmin && (
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Add table */}
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                        <input
                          type="text"
                          placeholder="Table title"
                          value={addTableTitleByCompany[companyIndex] || ""}
                          onChange={(e) =>
                            setAddTableTitleByCompany((prev) => ({
                              ...prev,
                              [companyIndex]: e.target.value,
                            }))
                          }
                          className="px-3 py-1.5 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          disabled={isSaving}
                        />
                        <button
                          onClick={() => handleAddTable(companyIndex)}
                          disabled={isSaving}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                          ➕ Add table
                        </button>
                      </div>

                      {/* Delete table */}
                      <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                        <select
                          value={deleteTableIndexByCompany[companyIndex] ?? ""}
                          onChange={(e) =>
                            setDeleteTableIndexByCompany((prev) => ({
                              ...prev,
                              [companyIndex]:
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                            }))
                          }
                          className="px-3 py-1.5 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm cursor-pointer"
                          disabled={
                            isSaving || (company.tables?.length || 0) === 0
                          }
                        >
                          <option value="">
                            {company.tables?.length || 0
                              ? "Select table"
                              : "No tables"}
                          </option>
                          {company.tables?.map((t, ti) => (
                            <option key={ti} value={ti}>
                              {t.title || `Table ${ti + 1}`}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDeleteTable(companyIndex)}
                          disabled={
                            isSaving ||
                            (deleteTableIndexByCompany[companyIndex] ?? "") ===
                            ""
                          }
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                          🗑️ Delete
                        </button>
                      </div>

                      {/* Edit company name */}
                      {editingCompanyNameIndex === companyIndex ? (
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                          <button
                            onClick={() => saveCompanyName(companyIndex)}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={cancelCompanyName}
                            disabled={isSaving}
                            className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm font-medium rounded-lg disabled:opacity-50 shadow-md transition-all"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditCompanyName(companyIndex)}
                          disabled={isSaving}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                          ✏️ Edit name
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {company.tables?.map((table, tableIndex) => (
                  <motion.div
                    key={`${companyIndex}-${tableIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: tableIndex * 0.05 }}
                  >
                    <EditableTable
                      data={table}
                      onUpdate={(updated) =>
                        handleUpdateTable(companyIndex, tableIndex, updated)
                      }
                      isEditing={isTableEditing(companyIndex, tableIndex)}
                      onEditToggle={() =>
                        handleEditTable(companyIndex, tableIndex)
                      }
                      onSave={handleSaveTable}
                      onCancel={handleCancelEdit}
                      isLoading={isSaving}
                      isAdmin={isAdmin}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300"
            >
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 text-lg font-medium">
                No companies or tables yet.
              </p>
              {isAdmin && (
                <p className="text-gray-500 text-sm mt-2">
                  Use the controls above to add your first company.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
      {/* Confirmation modal for delete actions */}
      {(showConfirmDeleteCompany || showConfirmDeleteTable) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <h3 className="text-lg font-semibold mb-3">Confirm deletion</h3>
            <p className="mb-4 text-sm text-gray-700">
              {showConfirmDeleteCompany && companyToDelete !== null
                ? `Delete company "${editableData?.companies[companyToDelete]?.name || "Unnamed"
                }" and all its contents?`
                : showConfirmDeleteTable
                  ? `Delete table "${editableData?.companies[showConfirmDeleteTable.companyIndex]
                    ?.tables?.[showConfirmDeleteTable.tableIndex]?.title ||
                  `Table ${showConfirmDeleteTable.tableIndex + 1}`
                  }"?`
                  : "Are you sure you want to delete this item?"}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmDeleteCompany(false);
                  setCompanyToDelete(null);
                  setShowConfirmDeleteTable(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={
                  showConfirmDeleteCompany
                    ? performDeleteCompany
                    : performDeleteTable
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tariffs;
