// src/components/AirportTable.js

import React from 'react';

const AirportTable = ({
  airports,
  sortBy,
  sortOrder,
  onSort,
  pagination,
  setPagination,
  filter, // <-- Add this prop back to the destructuring
}) => {

  // Calculate total pages based on the total items count from the API response
  const totalPages = pagination.total > 0 ? Math.ceil(pagination.total / pagination.limit) : 1;

  // Helper to render sort indicators
  const renderSortArrow = (field) => {
    if (sortBy === field) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full border-collapse bg-white">
        {/* ... thead remains the same ... */}
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("name")}>
              Name {renderSortArrow("name")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("city")}>
              City {renderSortArrow("city")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("state")}>
              State {renderSortArrow("state")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("country")}>
              Country {renderSortArrow("country")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700" onClick={() => onSort("region")}>
              Region {renderSortArrow("region")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("elevation")}>
              Elevation {renderSortArrow("elevation")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("iata")}>
              IATA {renderSortArrow("iata")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("icao")}>
              ICAO {renderSortArrow("icao")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("lat")}>
              Latitude {renderSortArrow("lat")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("lon")}>
              Longitude {renderSortArrow("lon")}
            </th>
            <th className="p-3 border text-left text-sm font-semibold text-gray-700 cursor-pointer" onClick={() => onSort("tz")}>
              Timezone {renderSortArrow("tz")}
            </th>
          </tr>
        </thead>
        <tbody>
          {airports && airports.length > 0 ? (
             airports.map((airport) => (
              <tr key={airport.id || airport.icao} className={`hover:bg-gray-50 ${airport.elevation > 8000 ? "bg-red-100 font-semibold text-red-800" : ""}`}>
                 {/* ... table data cells (td) ... */}
                <td className="p-3 border text-sm text-gray-800">{airport.name}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.city || "-"}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.state || "-"}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.country}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.region || "-"}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.elevation} ft</td>
                <td className="p-3 border text-sm text-gray-800">{airport.iata || "-"}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.icao}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.lat || "-"}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.lon || "-"}</td>
                <td className="p-3 border text-sm text-gray-800">{airport.tz || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              {/* This line now correctly uses the 'filter' prop */}
              <td colSpan={11} className="text-center p-4 border text-gray-500">
                {pagination.total === 0 && filter ? `No airports found matching "${filter}".` : "No airports available."}
              </td>
            </tr>
           )}
        </tbody>
      </table>

      {/* ... pagination controls remain the same ... */}
       {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 py-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600">
            Page {pagination.page} of {totalPages}
            <span className="hidden sm:inline"> ({pagination.total} items)</span>
          </span>
          <button
            disabled={pagination.page >= totalPages}
            onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
            className="px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AirportTable;