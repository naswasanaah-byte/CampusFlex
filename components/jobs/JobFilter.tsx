'use client';

import React from 'react';
import { useJobStore } from '@/store/useJobStore';
import { Search, Filter, RotateCcw, Sparkles, History, X } from 'lucide-react';

export const JobFilter: React.FC = () => {
  const { filters, setFilter, setSearchQuery, resetFilters, searchHistory, addSearchHistory, clearSearchHistory } = useJobStore();

  const departments = [
    'All Departments',
    'Computer Science',
    'Business Administration',
    'Hospitality & Business',
    'General Studies',
    'Engineering',
    'Arts & Media',
  ];

  const workTypes = ['All Types', 'Part-Time', 'Weekend', 'Evening', 'Remote', 'Flexible'];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-glass space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Search & Smart Filters
          </h3>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Bar Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Job Keyword or Title
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filters.searchQuery) {
                addSearchHistory(filters.searchQuery);
              }
            }}
            placeholder="Search e.g. Frontend, Catering, Remote Python..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Search History Chips */}
        {searchHistory.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 font-semibold">
                <History className="w-3 h-3" /> Recent Searches
              </span>
              <button onClick={clearSearchHistory} className="hover:text-rose-500">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {searchHistory.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(q)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Department Select */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Academic Department
        </label>
        <select
          value={filters.department}
          onChange={(e) => setFilter('department', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Work Type Pills */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Work Schedule Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {workTypes.map((type) => {
            const isSelected = filters.workType === type;
            return (
              <button
                key={type}
                onClick={() => setFilter('workType', type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Min Hourly Rate Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Min Hourly Pay</span>
          <span className="text-primary-600 font-extrabold">${filters.minSalary}/hr</span>
        </div>
        <input
          type="range"
          min="0"
          max="35"
          step="1"
          value={filters.minSalary}
          onChange={(e) => setFilter('minSalary', Number(e.target.value))}
          className="w-full accent-primary-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>$0/hr</span>
          <span>$35+/hr</span>
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Hiring Status
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          {[
            { key: 'ALL', label: 'All Jobs' },
            { key: 'AVAILABLE', label: 'Open Slots' },
            { key: 'FILLED', label: 'Filled' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter('status', key)}
              className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filters.status === key
                  ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
