import React from 'react';
import { Receipt } from '../types';
import { CloseIcon } from './Icons';

interface ReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number; isCurrency?: boolean }> = ({ label, value, isCurrency = false }) => (
    <div>
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className={`mt-1 text-lg ${isCurrency ? 'font-mono' : ''} text-white`}>
            {isCurrency && typeof value === 'number' ? `$${value.toFixed(2)}` : value}
        </dd>
    </div>
);


const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  // Prevent clicks inside the modal from closing it
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity"
      onClick={onClose}
      aria-labelledby="receipt-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl m-4 bg-gray-800 rounded-lg shadow-xl transform transition-all"
        onClick={handleModalContentClick}
      >
        <div className="p-6">
            <div className="flex justify-between items-start">
                <h2 id="receipt-modal-title" className="text-2xl font-bold text-white">
                    Receipt Details
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    aria-label="Close modal"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Image */}
            <div className="space-y-4">
                <img
                    src={receipt.thumbnail}
                    alt="Receipt thumbnail"
                    className="w-full h-auto object-contain rounded-lg border border-gray-700 max-h-96"
                />
                <a
                    href={receipt.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full text-indigo-400 hover:text-indigo-300 font-semibold py-2 px-4 rounded-lg border border-indigo-500 hover:bg-indigo-900/50 transition-colors"
                >
                    View Full Receipt
                </a>
            </div>

            {/* Right side: Details */}
            <div className="space-y-6">
                 <dl className="grid grid-cols-1 gap-y-6">
                    <DetailItem label="Company" value={receipt.company} />
                    <DetailItem label="Date" value={receipt.date} />
                    <DetailItem label="Category" value={receipt.category} />
                    <div>
                        <dt className="text-sm font-medium text-gray-400">Description</dt>
                        <dd className="mt-1 text-base text-gray-300">{receipt.description}</dd>
                    </div>
                     <div className="grid grid-cols-2 gap-y-4 gap-x-4 pt-4 border-t border-gray-700">
                        <DetailItem label="GST" value={receipt.gst} isCurrency />
                        <DetailItem label="PST" value={receipt.pst} isCurrency />
                        <DetailItem label="Total Tax" value={receipt.totalTax} isCurrency />
                        <DetailItem label="Grand Total" value={receipt.total} isCurrency />
                    </div>
                </dl>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
