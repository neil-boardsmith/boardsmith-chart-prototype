'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { ChartData } from '@/types/chart-types';

interface CSVImporterProps {
  onImport: (data: ChartData[]) => void;
  onClose: () => void;
}

export const CSVImporter: React.FC<CSVImporterProps> = ({ onImport, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ChartData[] | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setParsing(true);
    setError(null);

    Papa.parse(file, {
      complete: (result: Papa.ParseResult<string[]>) => {
        setParsing(false);
        
        if (result.errors.length > 0) {
          setError(`Parse error: ${result.errors[0].message}`);
          return;
        }

        if (result.data && result.data.length > 0) {
          // Convert to our data format
          const headers = result.data[0] as string[];
          const rows = result.data.slice(1) as string[][];
          
          const formattedData = rows
            .filter(row => row.some(cell => cell !== '')) // Filter out empty rows
            .map(row => {
              const obj: ChartData = { category: '' } as ChartData;
              headers.forEach((header, index) => {
                const value = row[index];
                // Try to parse numbers
                const numValue = parseFloat(value);
                obj[header] = isNaN(numValue) ? value : numValue;
              });
              return obj;
            });

          setPreview(formattedData.slice(0, 5)); // Show first 5 rows as preview
        }
      },
      error: (error) => {
        setParsing(false);
        setError(`Error reading file: ${error.message}`);
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      Papa.parse(text, {
        complete: (result) => {
          if (result.data && result.data.length > 0) {
            const headers = result.data[0] as string[];
            const rows = result.data.slice(1) as string[][];
            
            const formattedData = rows
              .filter(row => row.some(cell => cell !== ''))
              .map(row => {
                const obj: ChartData = { category: '' } as ChartData;
                headers.forEach((header, index) => {
                  const value = row[index];
                  const numValue = parseFloat(value);
                  obj[header] = isNaN(numValue) ? value : numValue;
                });
                return obj;
              });

            setPreview(formattedData.slice(0, 5));
          }
        },
        header: false,
        skipEmptyLines: true
      });
    } catch {
      setError('Failed to read clipboard');
    }
  };

  const confirmImport = () => {
    if (preview) {
      onImport(preview);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-lg font-semibold text-white">Import CSV Data</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!preview ? (
            <>
              {/* Upload Area */}
              <div
                className={`
                  relative border-2 border-dashed rounded-lg p-8
                  transition-colors cursor-pointer
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium mb-1">
                    Drop CSV file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports standard CSV format with headers
                  </p>
                </div>
              </div>

              {/* Or paste from clipboard */}
              <div className="mt-4 text-center">
                <span className="text-gray-500 text-sm">or</span>
                <button
                  onClick={handlePaste}
                  className="ml-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Paste from Clipboard
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Loading state */}
              {parsing && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">Parsing CSV...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Data Preview</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(preview[0]).map(key => (
                          <th key={key} className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value: any, i) => (
                            <td key={i} className="px-3 py-2 text-gray-900 border-b border-gray-100">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Showing first {preview.length} rows
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPreview(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={confirmImport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Import Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};