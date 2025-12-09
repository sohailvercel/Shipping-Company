import React, { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import { TariffTable } from "../types/tariff";

interface EditableTableProps {
  data: TariffTable;
  onUpdate: (updatedTable: TariffTable) => void;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

const isNumeric = (v: unknown) =>
  typeof v === "number" ||
  (/^-?\d+(?:[.,]\d+)?$/.test(String(v).trim()) && String(v).trim() !== "");

const EditableTable: React.FC<EditableTableProps> = ({
  data,
  onUpdate,
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  isLoading = false,
  isAdmin = false,
}) => {
  const [editedData, setEditedData] = useState<TariffTable>({ ...data });
  const [sizeRows, setSizeRows] = useState<string>("");
  const [sizeCols, setSizeCols] = useState<string>("");
  const [colToDelete, setColToDelete] = useState<number | "">("");

  useEffect(() => {
    setEditedData({ ...data });
  }, [data]);

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string | number
  ) => {
    setEditedData((prev) => {
      const rows = prev.rows.map((r, ri) =>
        ri === rowIndex
          ? r.map((c, ci) => (ci === colIndex ? value : c))
          : r
      );
      return { ...prev, rows };
    });
  };

  const handleTitleChange = (value: string) => {
    setEditedData((prev) => ({ ...prev, title: value }));
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    setEditedData((prev) => {
      const columns = [...prev.columns];
      columns[colIndex] = value;
      return { ...prev, columns };
    });
  };

  const handleAddRow = () => {
    if (!isEditing) return;
    setEditedData((prev) => {
      const emptyRow = prev.columns.map(() => "");
      return { ...prev, rows: [...prev.rows, emptyRow] };
    });
  };

  const handleDeleteRow = (rowIndex?: number) => {
    if (!isEditing) return;
    setEditedData((prev) => {
      if (prev.rows.length <= 1) return prev;
      const idx =
        typeof rowIndex === "number" ? rowIndex : prev.rows.length - 1;
      if (idx < 0 || idx >= prev.rows.length) return prev;
      return { ...prev, rows: prev.rows.filter((_, i) => i !== idx) };
    });
  };

  const handleAddColumn = () => {
    if (!isEditing) return;
    setEditedData((prev) => {
      const newColumns = [
        ...prev.columns,
        `Column ${prev.columns.length + 1}`,
      ];
      const newRows = prev.rows.map((r) => [...r, ""]);
      return { ...prev, columns: newColumns, rows: newRows };
    });
  };

  const handleDeleteColumn = () => {
    if (!isEditing || colToDelete === "") return;
    setEditedData((prev) => {
      if (prev.columns.length <= 1) return prev;
      const idx = Number(colToDelete);
      if (Number.isNaN(idx) || idx < 0 || idx >= prev.columns.length) {
        return prev;
      }
      const newColumns = prev.columns.filter((_, i) => i !== idx);
      const newRows = prev.rows.map((r) => r.filter((_, i) => i !== idx));
      return { ...prev, columns: newColumns, rows: newRows };
    });
    setColToDelete("");
  };

  const handleApplySize = () => {
    if (!isEditing) return;
    const rows = parseInt(sizeRows, 10);
    const cols = parseInt(sizeCols, 10);
    if (!Number.isFinite(rows) || !Number.isFinite(cols) || rows < 1 || cols < 1) {
      alert("Please enter valid positive numbers for rows and columns");
      return;
    }
    if (rows > 100 || cols > 20) {
      alert("Maximum size allowed is 100 rows × 20 columns");
      return;
    }
    setEditedData((prev) => {
      const columns = Array.from(
        { length: cols },
        (_, i) => prev.columns[i] || `Column ${i + 1}`
      );
      const rowsArr = Array.from({ length: rows }, (_, ri) =>
        Array.from({ length: cols }, (_, ci) => prev.rows[ri]?.[ci] ?? "")
      );
      return { ...prev, columns, rows: rowsArr };
    });
    setSizeRows("");
    setSizeCols("");
  };

  const handleSave = () => {
    onUpdate(editedData);
    onSave();
  };

  return (
    <div className="flex gap-4 mb-10">
      {/* Main table card */}
      <div className="flex-1 rounded-2xl bg-white shadow-md ring-1 ring-blue-100/70 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="w-full">
            {isEditing ? (
              <input
                type="text"
                value={editedData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 w-full max-w-md"
                placeholder="Table title"
              />
            ) : (
              <span className="inline-block text-2xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
                {editedData.title || "Untitled Table"}
                <span className="block h-1 w-16 mt-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full" />
              </span>
            )}
          </h3>

          {isAdmin && (
            <div className="ml-4 flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={onEditToggle}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                  title="Edit table"
                >
                  <FaEdit />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition disabled:opacity-50"
                    disabled={isLoading}
                    title="Save changes"
                  >
                    <FaSave className={isLoading ? "animate-spin" : ""} />
                  </button>
                  <button
                    onClick={onCancel}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                    disabled={isLoading}
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100/70">
              <tr className="divide-x divide-blue-100/70">
                {editedData.columns.map((column, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-6 py-3 text-left text-[11px] md:text-xs font-semibold uppercase tracking-wider text-blue-700"
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={column}
                        onChange={(e) =>
                          handleHeaderChange(colIndex, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        placeholder={`Column ${colIndex + 1}`}
                      />
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-md bg-blue-100/60 text-blue-800">
                        {column}
                      </span>
                    )}
                  </th>
                ))}
                {isEditing && <th className="w-12"></th>}
              </tr>
            </thead>

            <tbody className="bg-white">
              {editedData.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="divide-x divide-gray-100 even:bg-blue-50/40 hover:bg-blue-50 transition-colors"
                >
                  {row.map((cell, colIndex) => {
                    const numeric = isNumeric(cell);
                    const cellBase =
                      "px-6 py-3 align-top text-sm";
                    const textTone =
                      colIndex === 0
                        ? "font-semibold text-gray-900"
                        : numeric
                        ? "text-right font-medium text-gray-800"
                        : "text-gray-700";
                    return (
                      <td key={colIndex} className={`${cellBase} ${textTone}`}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={cell as string | number}
                            onChange={(e) =>
                              handleCellChange(
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        ) : (
                          <span>{String(cell)}</span>
                        )}
                      </td>
                    );
                  })}
                  {isEditing && (
                    <td className="px-2 py-3 text-right">
                      <button
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete this row"
                        disabled={editedData.rows.length <= 1}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right-side controls for admin edit mode */}
      {isAdmin && isEditing && (
        <aside className="w-80 shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-5 space-y-4 border border-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h4 className="text-lg font-bold text-gray-800">Table Controls</h4>
          </div>

          {/* Enter size */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📏 Enter Table Size
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                placeholder="Rows"
                value={sizeRows}
                onChange={(e) => setSizeRows(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                min={1}
                max={100}
              />
              <span className="text-gray-500 font-semibold">×</span>
              <input
                type="number"
                placeholder="Cols"
                value={sizeCols}
                onChange={(e) => setSizeCols(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                min={1}
                max={20}
              />
            </div>
            <button
              onClick={handleApplySize}
              disabled={!sizeRows || !sizeCols}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
            >
              ✓ Apply Size
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Max: 100 rows × 20 columns
            </p>
          </div>

          {/* Row controls */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📊 Row Controls
            </label>
            <div className="space-y-2">
              <button
                onClick={handleAddRow}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
              >
                <FaPlus /> Add Row
              </button>
              <button
                onClick={() => handleDeleteRow()}
                disabled={editedData.rows.length <= 1}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                <FaTrash /> Delete Last Row
              </button>
            </div>
          </div>

          {/* Column controls */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📋 Column Controls
            </label>
            <div className="space-y-2">
              <button
                onClick={handleAddColumn}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                <FaPlus /> Add Column
              </button>
              <select
                value={colToDelete}
                onChange={(e) =>
                  setColToDelete(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                disabled={editedData.columns.length <= 1}
              >
                <option value="">Select column to delete</option>
                {editedData.columns.map((c, i) => (
                  <option key={i} value={i}>
                    {c || `Column ${i + 1}`}
                  </option>
                ))}
              </select>
              <button
                onClick={handleDeleteColumn}
                disabled={colToDelete === "" || editedData.columns.length <= 1}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                <FaTrash /> Delete Column
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
            <p className="text-xs text-yellow-800">
              ✏️ Edit Mode: Click any cell to edit its content. Use these
              controls to manage structure. Save to persist changes.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
};

export default EditableTable;