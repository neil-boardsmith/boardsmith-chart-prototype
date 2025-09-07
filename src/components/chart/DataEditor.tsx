'use client';

import React, { useState, useCallback } from 'react';
import { DataRow } from '@/types/chart';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportToCSV } from '@/lib/data-utils';
import { CSVUpload } from './CSVUpload';

interface DataEditorProps {
  data: DataRow[];
  onChange: (data: DataRow[]) => void;
  editable?: boolean;
}

export function DataEditor({ data, onChange, editable = true }: DataEditorProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const updateCell = useCallback((rowIndex: number, column: string, value: string) => {
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [column]: isNaN(Number(value)) ? value : Number(value),
    };
    onChange(newData);
  }, [data, onChange]);

  const addRow = useCallback(() => {
    if (columns.length === 0) {
      // If no columns exist, create a default structure
      onChange([{ Category: 'Item 1', Value: 0 }]);
      return;
    }
    
    const newRow: DataRow = {};
    columns.forEach((col, index) => {
      // First column gets a text value, others get numeric
      newRow[col] = index === 0 ? `Item ${data.length + 1}` : 0;
    });
    onChange([...data, newRow]);
  }, [data, columns, onChange]);

  const deleteRow = useCallback((index: number) => {
    onChange(data.filter((_, i) => i !== index));
  }, [data, onChange]);

  const updateColumnName = useCallback((oldName: string, newName: string) => {
    if (oldName === newName) return;
    
    const newData = data.map(row => {
      const newRow: DataRow = {};
      Object.keys(row).forEach(key => {
        if (key === oldName) {
          newRow[newName] = row[key];
        } else {
          newRow[key] = row[key];
        }
      });
      return newRow;
    });
    onChange(newData);
  }, [data, onChange]);

  const handleCSVUpload = useCallback((newData: DataRow[]) => {
    onChange(newData);
    setShowUpload(false);
    setUploadError(null);
  }, [onChange]);

  const handleDownloadCSV = useCallback(() => {
    exportToCSV(data, 'chart-data.csv');
  }, [data]);

  const addColumn = useCallback(() => {
    if (data.length === 0) {
      // If no data exists, create a row with the new column
      onChange([{ Category: 'Item 1', [`Value${columns.length || 1}`]: 0 }]);
      return;
    }
    
    const newColumnName = columns.length === 0 ? 'Category' : `Value${columns.length}`;
    const newData = data.map(row => ({
      ...row,
      [newColumnName]: columns.length === 0 ? `Item ${data.indexOf(row) + 1}` : 0
    }));
    onChange(newData);
  }, [data, columns, onChange]);

  const deleteColumn = useCallback((columnName: string) => {
    if (columns.length <= 1) return; // Keep at least one column
    
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });
    onChange(newData);
  }, [data, columns, onChange]);

  return (
    <div className="w-full">
      {showUpload ? (
        <div className="space-y-4">
          <CSVUpload 
            onDataLoaded={handleCSVUpload}
            onError={setUploadError}
          />
          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {uploadError}
            </div>
          )}
          <button
            onClick={() => {
              setShowUpload(false);
              setUploadError(null);
            }}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {editable && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-3 h-3" />
                Upload CSV
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3 h-3" />
                Download CSV
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {columns.map((col, colIndex) => (
                    <th
                      key={`col-${colIndex}`}
                      className="px-3 py-2 text-left text-xs font-medium text-slate-900 border-b border-slate-200 min-w-[120px]"
                    >
                      {editable ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={col}
                            onChange={(e) => updateColumnName(col, e.target.value)}
                            className="flex-1 min-w-[80px] bg-transparent font-medium text-xs focus:outline-none focus:border-b-2 focus:border-teal-600"
                            placeholder="Column name"
                          />
                          {columns.length > 1 && (
                            <button
                              onClick={() => deleteColumn(col)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                              title="Delete column"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        col
                      )}
                    </th>
                  ))}
                  {editable && (
                    <th className="px-2 py-2 border-b border-slate-200">
                      <button
                        onClick={addColumn}
                        className="px-2 py-1 text-xs text-teal-800 hover:bg-teal-50 rounded transition-colors"
                        title="Add new column"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </th>
                  )}
                  {editable && <th className="w-10"></th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50">
                    {columns.map((col, colIndex) => (
                      <td
                        key={`cell-${colIndex}`}
                        className="px-3 py-1.5 border-b border-slate-100 text-xs"
                        onClick={() => editable && setEditingCell({ row: rowIndex, col })}
                      >
                        {editable && editingCell?.row === rowIndex && editingCell?.col === col ? (
                          <input
                            type="text"
                            value={String(row[col])}
                            onChange={(e) => updateCell(rowIndex, col, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setEditingCell(null);
                              }
                            }}
                            className="w-full px-2 py-1 text-xs border border-teal-600 rounded focus:outline-none focus:ring-1 focus:ring-teal-600"
                            autoFocus
                          />
                        ) : (
                          <div className={cn(
                            'px-2 py-0.5 rounded text-xs',
                            editable && 'cursor-pointer hover:bg-slate-100'
                          )}>
                            {String(row[col])}
                          </div>
                        )}
                      </td>
                    ))}
                    {editable && <td className="border-b border-slate-100"></td>}
                    {editable && (
                      <td className="px-2 py-1.5 border-b border-slate-100">
                        <button
                          onClick={() => deleteRow(rowIndex)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editable && (
            <button
              onClick={addRow}
              className="mt-2 flex items-center gap-2 px-3 py-1.5 text-xs text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Row
            </button>
          )}
        </div>
      )}
    </div>
  );
}