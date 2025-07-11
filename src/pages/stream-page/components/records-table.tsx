import React, { useMemo, useState } from "react";
import { SearchIcon } from "../../../assets"
import type { LicensePlate } from "../interface";
import { vehicleTypes } from "../constants";
import { useAuthStore } from "../../../store/auth-store";
import { tableAccessColumns } from "./constants";

const itemsPerPage = 10;

interface RecordsTableProps {
  data: LicensePlate[]
}

export const RecordsTable = ({ data }: RecordsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { role } = useAuthStore()

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) 
        || item.timestamp.toLocaleString().includes(searchTerm.toLowerCase())
        || item.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
        || item.confidence.toString().includes(searchTerm.toLowerCase());
      const matchesVehicleType = !vehicleTypeFilter || item.vehicleType === vehicleTypeFilter;
      const matchesDate = !dateFilter || 
        item.timestamp.toISOString().split('T')[0] === dateFilter;

      return matchesSearch && matchesVehicleType && matchesDate;
    });
  }, [data, searchTerm, vehicleTypeFilter, dateFilter]);
  
  const accessibleColumns = tableAccessColumns.filter((item) => role && item.accessLevel.includes(role))

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Vehicle Types</option>
              {vehicleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {accessibleColumns.map((item) => (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {accessibleColumns.map((column) => {
                      const value = item[column.key as keyof LicensePlate];
                      return React.cloneElement(column.renderCell(value as never), {
                        key: column.key
                      });
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={accessibleColumns.length} 
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
              {filteredData.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
