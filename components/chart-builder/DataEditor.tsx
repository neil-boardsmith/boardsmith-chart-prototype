'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Trash2, Upload, Download, Grid3x3 } from 'lucide-react';
import { CSVImporter } from '../data-management/CSVImporter';

interface DataEditorProps {
  data: any[];
  onChange: (data: any[]) => void;
}

export const DataEditor: React.FC<DataEditorProps> = ({ data, onChange }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showImporter, setShowImporter] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get column headers
  const columns = data.length > 0 ? Object.keys(data[0]) : ['category', 'value'];

  // Focus input when editing
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleCellClick = (row: number, col: string) => {
    setSelectedCell({ row, col });
  };

  const handleCellDoubleClick = (row: number, col: string) => {
    setEditingCell({ row, col });
    setEditValue(String(data[row][col] || ''));
  };

  const handleCellChange = (value: string) => {
    setEditValue(value);
  };

  const commitCellEdit = () => {
    if (editingCell) {
      const newData = [...data];
      const { row, col } = editingCell;
      
      // Try to parse as number if it looks like one
      const numValue = parseFloat(editValue);
      newData[row][col] = isNaN(numValue) || editValue === '' ? editValue : numValue;
      
      onChange(newData);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitCellEdit();
      // Move to next row
      if (editingCell && editingCell.row < data.length - 1) {
        const nextRow = editingCell.row + 1;
        setSelectedCell({ row: nextRow, col: editingCell.col });
        handleCellDoubleClick(nextRow, editingCell.col);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitCellEdit();
      // Move to next column
      if (editingCell) {
        const colIndex = columns.indexOf(editingCell.col);
        if (colIndex < columns.length - 1) {
          const nextCol = columns[colIndex + 1];
          setSelectedCell({ row: editingCell.row, col: nextCol });
          handleCellDoubleClick(editingCell.row, nextCol);
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const addRow = () => {
    const newRow: any = {};
    columns.forEach(col => {
      newRow[col] = col === 'category' ? `Item ${data.length + 1}` : 0;
    });
    onChange([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const addColumn = () => {
    const colName = `value${columns.length}`;
    const newData = data.map(row => ({
      ...row,
      [colName]: 0
    }));
    onChange(newData);
  };

  const deleteColumn = (colName: string) => {
    if (columns.length <= 2) return; // Keep at least 2 columns
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[colName];
      return newRow;
    });
    onChange(newData);
  };

  const handleImport = (importedData: any[]) => {
    onChange(importedData);
    setShowImporter(false);
  };

  const exportData = () => {
    const csv = [
      columns.join(','),
      ...data.map(row => columns.map(col => row[col]).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
            title="Add Row"
          >
            <Plus className="w-3 h-3" />
            Row
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors"
            title="Add Column"
          >
            <Plus className="w-3 h-3" />
            Column
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImporter(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            title="Import CSV"
          >
            <Upload className="w-3 h-3" />
            Import
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
            title="Export CSV"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Excel-like Grid */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-b from-gray-50 to-gray-100">
              <th className="w-10 border-r border-b border-gray-300 bg-gray-100">
                <Grid3x3 className="w-4 h-4 mx-auto text-gray-500" />
              </th>
              {columns.map((col, index) => (
                <th
                  key={col}
                  className="relative border-r border-b border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100"
                >
                  <div className="flex items-center justify-between px-3 py-2">
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => {
                        const newColumns = [...columns];
                        const oldCol = columns[index];
                        const newCol = e.target.value;
                        
                        const newData = data.map(row => {
                          const newRow = { ...row };
                          newRow[newCol] = newRow[oldCol];
                          delete newRow[oldCol];
                          return newRow;
                        });
                        onChange(newData);
                      }}
                      className="flex-1 text-xs font-semibold text-gray-700 bg-transparent outline-none"
                    />
                    {columns.length > 2 && (
                      <button
                        onClick={() => deleteColumn(col)}
                        className="ml-1 p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                <td className="border-r border-b border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 text-center text-xs font-medium text-gray-600">
                  <div className="flex items-center justify-between px-1">
                    <span>{rowIndex + 1}</span>
                    {data.length > 1 && (
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
                {columns.map(col => {
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === col;
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === col;
                  
                  return (
                    <td
                      key={col}
                      className={`
                        border-r border-b border-gray-200 px-3 py-1.5 text-sm
                        ${isSelected ? 'ring-2 ring-inset ring-teal-500 bg-teal-50/50' : ''}
                        ${isEditing ? 'ring-2 ring-inset ring-blue-500 bg-blue-50' : ''}
                        ${!isEditing ? 'cursor-cell' : ''}
                      `}
                      onClick={() => handleCellClick(rowIndex, col)}
                      onDoubleClick={() => handleCellDoubleClick(rowIndex, col)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => handleCellChange(e.target.value)}
                          onBlur={commitCellEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full px-1 py-0 text-sm bg-white border border-blue-400 rounded outline-none"
                        />
                      ) : (
                        <span className="block w-full font-mono text-gray-900">
                          {row[col] != null ? String(row[col]) : ''}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-3 text-xs text-gray-500">
        <span className="font-medium">Tips:</span> Double-click to edit • Enter to save • Tab to move right • Escape to cancel
      </div>

      {/* CSV Importer Modal */}
      {showImporter && (
        <CSVImporter
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
};