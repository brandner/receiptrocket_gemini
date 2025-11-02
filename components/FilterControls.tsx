import React, { useState } from 'react';
import { SearchIcon, FilterIcon, ClearIcon, ChevronDownIcon } from './Icons';

interface FilterControlsProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    allCategories: string[];
    onClearFilters: () => void;
    hasFilters: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    allCategories,
    onClearFilters,
    hasFilters
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 sm:p-6"
                aria-expanded={isOpen}
                aria-controls="filter-panel"
            >
                <div className="flex items-center gap-2">
                    <FilterIcon className="w-6 h-6 text-gray-400"/>
                    <h2 className="text-xl font-semibold text-white">Filter Receipts</h2>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Accordion Content */}
            <div
                id="filter-panel"
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                <div className="p-4 sm:p-6 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by company or item..."
                                className="block w-full rounded-md border-0 bg-white/5 py-2 pl-10 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                        </div>

                        {/* Category Select */}
                        <div>
                            <label htmlFor="category" className="sr-only">Category</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            >
                                <option value="">All Categories</option>
                                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium leading-6 text-gray-400">Start Date</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                             <div>
                                <label htmlFor="end-date" className="block text-sm font-medium leading-6 text-gray-400">End Date</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        {/* Clear Button */}
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={onClearFilters}
                                disabled={!hasFilters}
                                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                            >
                                <ClearIcon className="w-5 h-5"/>
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterControls;