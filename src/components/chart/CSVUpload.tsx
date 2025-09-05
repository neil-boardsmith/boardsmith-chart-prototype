'use client';

import React, { useRef } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { parseCSV, validateData } from '@/lib/data-utils';
import { DataRow } from '@/types/chart';

interface CSVUploadProps {
  onDataLoaded: (data: DataRow[]) => void;
  onError?: (error: string) => void;
}

export function CSVUpload({ onDataLoaded, onError }: CSVUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      onError?.('Please upload a CSV file');
      return;
    }

    try {
      const data = await parseCSV(file);
      
      if (!validateData(data)) {
        throw new Error('Invalid data structure in CSV file');
      }

      onDataLoaded(data);
    } catch (error) {
      onError?.((error as Error).message || 'Failed to parse CSV file');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    
    if (file && file.name.endsWith('.csv')) {
      try {
        const data = await parseCSV(file);
        if (!validateData(data)) {
          throw new Error('Invalid data structure in CSV file');
        }
        onDataLoaded(data);
      } catch (error) {
        onError?.((error as Error).message || 'Failed to parse CSV file');
      }
    } else {
      onError?.('Please upload a CSV file');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-teal-600 transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-8 h-8 text-slate-400" />
          <Upload className="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            Drop CSV file here or click to upload
          </p>
          <p className="text-xs text-slate-500 mt-1">
            First row should contain column headers
          </p>
        </div>
      </div>
    </div>
  );
}