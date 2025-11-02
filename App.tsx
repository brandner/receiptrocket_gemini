import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ReceiptTable from './components/ReceiptTable';
import FilterControls from './components/FilterControls';
import ReceiptModal from './components/ReceiptModal';
import { extractReceiptInfo } from './services/geminiService';
import { Receipt } from './types';

const App: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const imageDataUrl = reader.result as string;
          const extractedInfo = await extractReceiptInfo(imageDataUrl);
          const newReceipt: Receipt = {
              ...extractedInfo,
              thumbnail: imageDataUrl
          };
          setReceipts(prevReceipts => [newReceipt, ...prevReceipts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during processing.");
            }
        } finally {
            setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setIsLoading(false);
      };
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred.");
        }
      setIsLoading(false);
    }
  };

  const allCategories = useMemo(() => [...new Set(receipts.map(r => r.category))], [receipts]);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      // Adjust start and end dates to be inclusive
      if(start) start.setUTCHours(0,0,0,0);
      if(end) end.setUTCHours(23,59,59,999);


      const matchesSearch = searchTerm.toLowerCase() 
        ? receipt.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
          receipt.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory ? receipt.category === selectedCategory : true;
      const matchesDate = (!start || receiptDate >= start) && (!end || receiptDate <= end);

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [receipts, searchTerm, selectedCategory, startDate, endDate]);

  const handleClearFilters = () => {
      setSearchTerm('');
      setSelectedCategory('');
      setStartDate('');
      setEndDate('');
  };
  
  const handleRowClick = (receipt: Receipt) => {
      setSelectedReceipt(receipt);
  };

  const handleCloseModal = () => {
      setSelectedReceipt(null);
  };

  const isFiltered = !!(searchTerm || selectedCategory || startDate || endDate);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-8">
          <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <FilterControls 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            allCategories={allCategories}
            onClearFilters={handleClearFilters}
            hasFilters={isFiltered}
          />

          <ReceiptTable receipts={filteredReceipts} isFiltered={isFiltered} onRowClick={handleRowClick}/>
        </div>
      </main>

      {selectedReceipt && <ReceiptModal receipt={selectedReceipt} onClose={handleCloseModal} />}

      <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
