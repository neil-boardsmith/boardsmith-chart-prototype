import Papa from 'papaparse';
import { DataRow } from '@/types/chart';

export const parseCSV = (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
        } else {
          resolve(results.data as DataRow[]);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const validateData = (data: DataRow[]): boolean => {
  if (!data || data.length === 0) return false;
  
  // Check if all rows have the same structure
  const firstRowKeys = Object.keys(data[0]);
  return data.every(row => {
    const rowKeys = Object.keys(row);
    return rowKeys.length === firstRowKeys.length &&
           rowKeys.every(key => firstRowKeys.includes(key));
  });
};

export const exportToCSV = (data: DataRow[], filename: string = 'chart-data.csv') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};