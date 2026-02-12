import React, { useState, useMemo } from 'react';
import { weightService } from '../services/weightService';
import { StatsCard } from '../components/historyLog/StatsCard';
import { SearchToolbar } from '../components/historyLog/SearchToolbar';
import { HistoryTable } from '../components/historyLog/HistoryTable';
import { Pagination } from '../components/historyLog/Pagination';
import { calculateStats, formatWeight as formatWeightUtil, formatDate, formatTime } from '../utils/weightUtils';

export const HistoryLog = ({ history = [], unit = 'kg', onDataChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Handle delete weight record
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) {
            return;
        }

        try {
            await weightService.deleteWeight(id);
            alert('Record deleted successfully');
            // Notify parent to reload data
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete record');
        }
    };

    // Filter Data - search by status, weight, date, or time
    const filteredHistory = useMemo(() => {
        if (!searchTerm.trim()) return history;
        
        const searchLower = searchTerm.toLowerCase();
        
        return history.filter(record => {
            const date = new Date(record.timestamp);
            
            // Format date parts for searching
            const dateStr = date.toLocaleDateString('en-US'); // "2/8/2026"
            const timeStr = date.toLocaleTimeString('en-US', { hour12: false }); // "05:29:51"
            const fullDateTime = `${dateStr} ${timeStr}`; // "2/8/2026 05:29:51"
            
            return (
                record.status.toLowerCase().includes(searchLower) ||
                record.weight.toString().includes(searchTerm) ||
                fullDateTime.includes(searchTerm)
            );
        });
    }, [history, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedData = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate statistics from history data
    const stats = useMemo(() => calculateStats(history), [history]);

    const formatWeight = (val) => formatWeightUtil(val, unit);

    return (
        <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weighing History</h1>
                    <p className="text-gray-500 text-sm">Review your past records and trends.</p>
                </div>
            </div>

            <StatsCard stats={stats} unit={unit} formatWeight={formatWeight} />

            <div className="bg-white dark:bg-[#111618] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col min-h-125">
                <SearchToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                
                <HistoryTable 
                    paginatedData={paginatedData}
                    filteredHistory={filteredHistory}
                    unit={unit}
                    formatWeight={formatWeight}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    onDelete={handleDelete}
                />

                <Pagination 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredHistory.length}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};
