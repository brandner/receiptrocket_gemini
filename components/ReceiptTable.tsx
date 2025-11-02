import React from 'react';
import { Receipt } from '../types';
import { ExportIcon, ReceiptIcon } from './Icons';

interface ReceiptTableProps {
  receipts: Receipt[];
  isFiltered: boolean;
  onRowClick: (receipt: Receipt) => void;
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({ receipts, isFiltered, onRowClick }) => {
  const handleExport = () => {
    if (receipts.length === 0) return;

    const headers = ["Date", "Company", "Category", "Description", "GST", "PST", "Total Tax", "Total"];
    const csvRows = [
      headers.join(','),
      ...receipts.map(receipt => 
        [
          `"${receipt.date}"`,
          `"${receipt.company.replace(/"/g, '""')}"`, // Escape double quotes
          `"${receipt.category.replace(/"/g, '""')}"`,
          `"${receipt.description.replace(/"/g, '""')}"`,
          receipt.gst.toFixed(2),
          receipt.pst.toFixed(2),
          receipt.totalTax.toFixed(2),
          receipt.total.toFixed(2)
        ].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'receipts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (receipts.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-800 rounded-lg shadow-lg">
        <ReceiptIcon className="w-16 h-16 mx-auto text-gray-500" />
        <h3 className="mt-4 text-xl font-semibold text-white">{isFiltered ? "No Receipts Match Filters" : "No receipts scanned yet"}</h3>
        <p className="mt-1 text-gray-400">{isFiltered ? "Try adjusting your search criteria." : "Upload a receipt image to get started."}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Scanned Receipts</h2>
            <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
            >
                <ExportIcon className="w-5 h-5" />
                Export to CSV
            </button>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Company</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3 text-right">GST</th>
                <th scope="col" className="px-6 py-3 text-right">PST</th>
                <th scope="col" className="px-6 py-3 text-right">Total Tax</th>
                <th scope="col" className="px-6 py-3 text-right">Total</th>
            </tr>
            </thead>
            <tbody>
            {receipts.map((receipt, index) => (
                <tr 
                  key={index} 
                  className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => onRowClick(receipt)}
                >
                    <td className="px-6 py-4 whitespace-nowrap">{receipt.date}</td>
                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{receipt.company}</th>
                    <td className="px-6 py-4">{receipt.category}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={receipt.description}>{receipt.description}</td>
                    <td className="px-6 py-4 text-right font-mono">${receipt.gst.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono">${receipt.pst.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono">${receipt.totalTax.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-mono">${receipt.total.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default ReceiptTable;
