'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Plus, Trash2, Upload, Download, Grid3x3, Clipboard, RotateCcw, ArrowRightLeft, ArrowUpDown } from 'lucide-react';
import { CSVImporter } from '../data-management/CSVImporter';
import { ChartData, EditableChartData } from '@/types/chart-types';

interface DataEditorProps {
  data: ChartData[];
  onChange: (data: ChartData[]) => void;
  isExpanded?: boolean;
}

// Helper function to convert EditableChartData to ChartData with defaults
const toChartData = (item: EditableChartData): ChartData => ({
  category: item.category || '',
  ...Object.fromEntries(
    Object.entries(item).filter(([key]) => key !== 'category')
  )
});

export const DataEditor: React.FC<DataEditorProps> = ({ data, onChange, isExpanded = false }) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showImporter, setShowImporter] = useState(false);
  const [showPasteHelper, setShowPasteHelper] = useState(false);
  interface PastePreview {
    data: ChartData[];
    preview: {
      detectedFormat: string;
      headers: string[];
      sampleData: ChartData[];
      totalRows: number;
      totalColumns: number;
    } | null;
  }
  const [pastePreview, setPastePreview] = useState<PastePreview | null>(null);
  const [pasteText, setPasteText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Get column headers - always show extra columns for expansion
  const existingColumns = useMemo(() => {
    return data.length > 0 ? Object.keys(data[0]) : ['category', 'value'];
  }, [data]);
  
  const columns = useMemo(() => {
    const extraColumns = isExpanded ? 5 : 2; // More extra columns in expanded view
    const emptyColumnNames = Array.from({ length: extraColumns }, (_, i) => 
      `series${existingColumns.length + i}`
    ).filter(name => !existingColumns.includes(name));
    return [...existingColumns, ...emptyColumnNames];
  }, [existingColumns, isExpanded]);

  // Create extra empty rows for expansion
  const extraRows = isExpanded ? 5 : 3; // More extra rows in expanded view
  const emptyRows: EditableChartData[] = Array.from({ length: extraRows }, () => ({}));
  const displayData: (ChartData | EditableChartData)[] = [...data, ...emptyRows];

  // Detect current data orientation
  const detectOrientation = useCallback(() => {
    if (data.length === 0) return 'categories-vertical';
    const firstColumn = columns[0];
    // If first column is 'category' or contains category-like data, it's vertical
    return firstColumn?.toLowerCase().includes('category') || firstColumn?.toLowerCase().includes('label') 
      ? 'categories-vertical' : 'categories-horizontal';
  }, [data.length, columns]);
  
  const [orientation, setOrientation] = useState<'categories-vertical' | 'categories-horizontal'>('categories-vertical');
  
  useEffect(() => {
    setOrientation(detectOrientation());
  }, [detectOrientation]);

  // Focus input when editing
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleCellClick = (row: number, col: string) => {
    setSelectedCell({ row, col });
    setEditingCell({ row, col });
    // Handle empty rows by getting data from displayData
    setEditValue(String(displayData[row]?.[col] || ''));
  };

  const handleCellChange = (value: string) => {
    setEditValue(value);
  };

  const commitCellEdit = () => {
    if (editingCell) {
      const newData = [...data];
      const { row, col } = editingCell;
      
      // If editing beyond existing data, extend the array with empty objects
      while (newData.length <= row) {
        const emptyRow: ChartData = { category: `Item ${newData.length + 1}` } as ChartData;
        existingColumns.forEach(column => {
          emptyRow[column] = column === 'category' ? `Item ${newData.length + 1}` : '';
        });
        newData.push(emptyRow);
      }
      
      // Ensure the row object exists
      if (!newData[row]) {
        newData[row] = {} as EditableChartData;
      }
      
      // Try to parse as number if it looks like one
      const numValue = parseFloat(editValue);
      newData[row][col] = isNaN(numValue) || editValue === '' ? editValue : numValue;
      
      onChange(newData);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitCellEdit();
      // Move down to next row
      if (editingCell && editingCell.row < displayData.length - 1) {
        const nextRow = editingCell.row + 1;
        handleCellClick(nextRow, editingCell.col);
      }
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      commitCellEdit();
      // Move up to previous row
      if (editingCell && editingCell.row > 0) {
        const prevRow = editingCell.row - 1;
        handleCellClick(prevRow, editingCell.col);
      }
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      commitCellEdit();
      // Move right to next column
      if (editingCell) {
        const colIndex = columns.indexOf(editingCell.col);
        if (colIndex < columns.length - 1) {
          const nextCol = columns[colIndex + 1];
          handleCellClick(editingCell.row, nextCol);
        } else if (editingCell.row < displayData.length - 1) {
          // Move to first column of next row
          handleCellClick(editingCell.row + 1, columns[0]);
        }
      }
    } else if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      commitCellEdit();
      // Move left to previous column
      if (editingCell) {
        const colIndex = columns.indexOf(editingCell.col);
        if (colIndex > 0) {
          const prevCol = columns[colIndex - 1];
          handleCellClick(editingCell.row, prevCol);
        } else if (editingCell.row > 0) {
          // Move to last column of previous row
          handleCellClick(editingCell.row - 1, columns[columns.length - 1]);
        }
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const addRow = () => {
    const newRow: EditableChartData = { category: `Item ${data.length + 1}` };
    existingColumns.forEach(col => {
      newRow[col] = col === 'category' ? `Item ${data.length + 1}` : 0;
    });
    onChange([...data, newRow]);
  };

  const deleteRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const addColumn = () => {
    const colName = `series${existingColumns.length}`;
    const newData = data.map(row => ({
      ...row,
      [colName]: 0
    }));
    onChange(newData);
  };

  const deleteColumn = (colName: string) => {
    if (existingColumns.length <= 2) return; // Keep at least 2 columns of actual data
    if (!existingColumns.includes(colName)) return; // Don't delete empty columns
    const newData = data.map(row => {
      const newRow = { ...row };
      delete newRow[colName];
      return newRow;
    });
    onChange(newData);
  };

  const handleImport = (importedData: ChartData[]) => {
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

  const parsePastedData = (text: string): PastePreview => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return { data: [], preview: null };
    
    // Parse each line by splitting on tabs (Excel/Sheets) or commas (CSV)
    const parsedRows = lines.map(line => {
      // Try tab-separated first (Excel/Sheets), then comma-separated
      const cells = line.includes('\t') ? line.split('\t') : line.split(',');
      return cells.map(cell => {
        const trimmed = cell.trim();
        // Remove quotes if present
        const unquoted = trimmed.replace(/^["']|["']$/g, '');
        // Try to parse as number
        const num = parseFloat(unquoted);
        return isNaN(num) ? unquoted : num;
      });
    });
    
    if (parsedRows.length === 0) return { data: [], preview: null };
    
    // Analyze the data structure
    const firstRow = parsedRows[0];
    const secondRow = parsedRows.length > 1 ? parsedRows[1] : null;
    
    // Check if first row looks like headers
    const firstRowAllStrings = firstRow.every(cell => typeof cell === 'string');
    const firstRowHasNumbers = firstRow.some(cell => typeof cell === 'number');
    const secondRowHasNumbers = secondRow ? secondRow.some(cell => typeof cell === 'number') : false;
    
    // Detect if first column might be categories
    const firstColumnAllStrings = parsedRows.every(row => typeof row[0] === 'string');
    const hasMultipleColumns = firstRow.length > 1;
    
    let headers: string[];
    let dataRows: (string | number)[][];
    let detectedFormat: string = 'unknown';
    
    // Smart detection of data format
    if (firstRowAllStrings && !firstRowHasNumbers && secondRowHasNumbers && parsedRows.length > 1) {
      // First row is headers
      headers = firstRow as string[];
      dataRows = parsedRows.slice(1);
      detectedFormat = 'headers-in-first-row';
      
      // Clean up common header patterns - make first column 'category' regardless of what it says
      headers = headers.map((h, i) => {
        if (i === 0) {
          return 'category'; // Always make first column the category
        }
        // Preserve series names but ensure they're valid
        const cleanHeader = String(h).replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^_+|_+$/g, '');
        return cleanHeader || `series${i}`;
      });
    } else if (firstColumnAllStrings && hasMultipleColumns) {
      // First column might be categories, no header row
      headers = ['category'];
      for (let i = 1; i < firstRow.length; i++) {
        headers.push(`series${i}`);
      }
      dataRows = parsedRows;
      detectedFormat = 'categories-in-first-column';
    } else {
      // Default: treat as data without headers
      headers = firstRow.map((_, i) => i === 0 ? 'category' : `series${i}`);
      dataRows = parsedRows;
      detectedFormat = 'data-only';
    }
    
    // Convert to object format
    const result = dataRows.map(row => {
      const obj: EditableChartData = {};
      headers.forEach((header, i) => {
        obj[header] = i < row.length ? row[i] : '';
      });
      return obj;
    });
    
    // Create preview info
    const preview = {
      detectedFormat,
      headers,
      sampleData: result.slice(0, 3),
      totalRows: result.length,
      totalColumns: headers.length
    };
    
    return { data: result, preview };
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const result = parsePastedData(text);
      if (result.data.length > 0) {
        // Show preview for confirmation
        setShowPasteHelper(true);
        setPastePreview(result);
        setPasteText(text);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
      // Fallback: show paste helper
      setShowPasteHelper(true);
      setPastePreview(null);
      setPasteText('');
    }
  };

  const handlePasteInput = (text: string) => {
    const result = parsePastedData(text);
    setPastePreview(result);
    setPasteText(text);
  };
  
  const confirmPaste = () => {
    if (pastePreview && pastePreview.data.length > 0) {
      onChange(pastePreview.data);
      setShowPasteHelper(false);
      setPastePreview(null);
      setPasteText('');
    }
  };

  const transposeData = () => {
    if (data.length === 0) return;
    
    const currentColumns = columns;
    const newData: EditableChartData[] = [];
    
    // Get the category values from the first column
    const categoryValues = data.map(row => row[currentColumns[0]]);
    
    // Create new rows for each original column (except the first one which was categories)
    currentColumns.slice(1).forEach((colName) => {
      const newRow: EditableChartData = { category: `Item ${data.length + 1}` };
      newRow['category'] = colName; // The old column name becomes the new category
      
      // Fill in the data values
      data.forEach((row, rowIndex) => {
        newRow[categoryValues[rowIndex]] = row[colName];
      });
      
      newData.push(newRow);
    });
    
    onChange(newData);
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="mb-2 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={addRow}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
            title="Add Row"
          >
            <Plus className="w-3 h-3" />
            Row
          </button>
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
            title="Add Column"
          >
            <Plus className="w-3 h-3" />
            Column
          </button>
          <button
            onClick={transposeData}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 rounded transition-colors"
            title="Switch Rows ⇄ Columns"
          >
            <RotateCcw className="w-3 h-3" />
            Flip
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded transition-colors"
            title="Paste from Excel/Sheets"
          >
            <Clipboard className="w-3 h-3" />
            Paste
          </button>
          <button
            onClick={() => setShowImporter(true)}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
            title="Import CSV"
          >
            <Upload className="w-3 h-3" />
            Import
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors"
            title="Export CSV"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>

      {/* Orientation Helper */}
      <div className="mb-2 flex items-center gap-2 text-[10px] text-gray-600 bg-gray-50 px-2 py-1 rounded">
        <div className="flex items-center gap-1">
          {orientation === 'categories-vertical' ? (
            <>
              <ArrowUpDown className="w-3 h-3" />
              <span>Categories ↓ (rows) • Series → (columns)</span>
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-3 h-3" />
              <span>Categories → (columns) • Series ↓ (rows)</span>
            </>
          )}
        </div>
        <span className="text-gray-400">•</span>
        <span>Use &quot;Flip&quot; to switch orientation</span>
      </div>

      {/* Excel-like Grid */}
      <div 
        ref={tableRef}
        className={`border border-gray-300 rounded-lg overflow-auto bg-white ${isExpanded ? 'max-h-[calc(100vh-300px)]' : 'max-h-64'}`}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text');
          if (text) {
            const result = parsePastedData(text);
            if (result.data.length > 0) {
              setShowPasteHelper(true);
              setPastePreview(result);
              setPasteText(text);
            }
          }
        }}
        tabIndex={0}
      >
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="bg-gradient-to-b from-gray-50 to-gray-100">
              <th className="w-8 border-r border-b border-gray-300 bg-gray-100">
                <Grid3x3 className="w-3 h-3 mx-auto text-gray-500" />
              </th>
              {columns.map((col, index) => (
                <th
                  key={col}
                  className={`relative border-r border-b border-gray-300 ${
                    index === 0 && orientation === 'categories-vertical'
                      ? 'bg-gradient-to-b from-blue-50 to-blue-100'
                      : 'bg-gradient-to-b from-gray-50 to-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between px-2 py-1">
                    <input
                      type="text"
                      value={col}
                      onChange={(e) => {
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
                      className={`flex-1 text-[11px] font-semibold bg-transparent outline-none ${
                        index === 0 && orientation === 'categories-vertical'
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}
                    />
                    {existingColumns.length > 2 && existingColumns.includes(col) && (
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
            {displayData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors whitespace-nowrap">
                <td className={`border-r border-b border-gray-300 text-center text-[10px] font-medium w-8 ${
                  orientation === 'categories-horizontal'
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600'
                }`}>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px]">{rowIndex + 1}</span>
                    {data.length > 1 && rowIndex < data.length && (
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
                        border-r border-b border-gray-200 px-2 py-1 text-xs min-w-[80px] h-8
                        ${isSelected ? 'ring-2 ring-inset ring-teal-500 bg-teal-50/50' : ''}
                        ${isEditing ? 'ring-2 ring-inset ring-blue-500 bg-blue-50' : ''}
                        ${!isEditing ? 'cursor-cell' : ''}
                        ${(columns.indexOf(col) === 0 && orientation === 'categories-vertical') 
                          ? 'bg-blue-50/30' 
                          : ''}
                      `}
                      onClick={() => handleCellClick(rowIndex, col)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => handleCellChange(e.target.value)}
                          onBlur={commitCellEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full px-1 py-0 text-xs bg-white border border-blue-400 rounded outline-none h-5"
                        />
                      ) : (
                        <span className="block w-full font-mono text-[11px] text-gray-900 h-5 leading-5">
                          {row?.[col] != null ? String(row[col]) : ''}
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
      <div className="mt-2 text-[10px] text-gray-500">
        <span className="font-medium">Tips:</span> Click to edit • Enter ↓ • Tab → • Shift+Enter ↑ • Shift+Tab ← • Escape to cancel
      </div>

      {/* CSV Importer Modal */}
      {showImporter && (
        <CSVImporter
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}

      {/* Paste Helper Modal */}
      {showPasteHelper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-sm font-semibold mb-3">Paste Data</h3>
            
            {!pastePreview ? (
              <>
                <p className="text-xs text-gray-600 mb-3">
                  Paste your Excel or Google Sheets data below. The first row can contain column headers (category name and series names).
                </p>
                <textarea
                  className="w-full h-32 text-xs border border-gray-300 rounded p-2 font-mono"
                  placeholder="Paste your data here...\n\nExample with headers:\nMonth\tSales\tProfit\nJan\t100\t20\nFeb\t150\t35\n\nExample without headers:\nJan\t100\t20\nFeb\t150\t35"
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData('text');
                    handlePasteInput(text);
                  }}
                />
                {pasteText && (
                  <button
                    onClick={() => handlePasteInput(pasteText)}
                    className="mt-2 px-3 py-1 text-xs bg-teal-600 text-white hover:bg-teal-700 rounded transition-colors"
                  >
                    Preview Data
                  </button>
                )}
              </>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    Detected Format: {pastePreview.preview?.detectedFormat?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {pastePreview.preview?.totalRows || 0} rows × {pastePreview.preview?.totalColumns || 0} columns
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Column Headers: {pastePreview.preview?.headers?.join(', ') || 'None'}
                  </p>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">Preview (first 3 rows):</p>
                <div className="flex-1 overflow-auto border border-gray-200 rounded">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        {pastePreview.preview?.headers?.map((header: string, i: number) => (
                          <th key={i} className="px-2 py-1 text-left font-medium border-b border-r border-gray-200">
                            {header}
                          </th>
                        )) || null}
                      </tr>
                    </thead>
                    <tbody>
                      {pastePreview.preview?.sampleData?.map((row: ChartData, i: number) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {pastePreview.preview?.headers?.map((header: string, j: number) => (
                            <td key={j} className="px-2 py-1 border-b border-r border-gray-200">
                              {row[header]}
                            </td>
                          )) || null}
                        </tr>
                      )) || null}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      setPastePreview(null);
                      setPasteText('');
                    }}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    ← Edit Data
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowPasteHelper(false);
                        setPastePreview(null);
                        setPasteText('');
                      }}
                      className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmPaste}
                      className="px-4 py-1 text-xs bg-teal-600 text-white hover:bg-teal-700 rounded transition-colors"
                    >
                      Import Data
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {!pastePreview && (
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowPasteHelper(false);
                    setPasteText('');
                  }}
                  className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};