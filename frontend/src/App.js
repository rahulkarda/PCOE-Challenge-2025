import React, { useState, useEffect, useCallback } from "react";
import AirportTable from "./components/AirportTable";
import AirportForm from "./components/AirportForm";
import DeleteAirportForm from "./components/DeleteAirportForm";
import AirportStatistics from "./components/AirportStatistics";
import { fetchAirports, fetchStatistics } from "./services/api";

function App() {
  const [airports, setAirports] = useState([]);
  const [filter, setFilter] = useState(""); // Filter state for searching by airport name
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [statistics, setStatistics] = useState({
    averageElevation: 0,
    noIataCount: 0,
    noIataAirports: [],
    topTimezones: [],
    elevationPerCountry: [],
  });

  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });

  // Fetch airports - passes filter, sort, pagination to backend
  const loadAirports = useCallback(async () => {
    console.log(`Workspaceing page ${pagination.page}, limit ${pagination.limit}, filter: '${filter}', sort: ${sortBy} ${sortOrder}`); // Optional: for debugging
    try {
      const { airports: fetchedAirports, total, page, limit } = await fetchAirports(
        sortBy,
        sortOrder,
        filter, // Pass the filter state to the backend API call
        pagination.page,
        pagination.limit
      );
      setAirports(fetchedAirports); // Update state with data already filtered by backend
      // Update pagination state, including total count based on the filtered result set
      setPagination(prev => ({ ...prev, page, limit, total }));
    } catch (error) {
      console.error("Error loading airports:", error);
      setAirports([]); // Reset airports on error
      setPagination(prev => ({ ...prev, page: 1, total: 0 })); // Reset pagination on error
    }
  }, [sortBy, sortOrder, filter, pagination.page, pagination.limit]); // useCallback dependencies

  // Fetch statistics
  const loadStatistics = useCallback(async () => {
    try {
      const stats = await fetchStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  }, []);

  // Trigger data fetch whenever loadAirports dependencies change (filter, pagination, sorting)
  useEffect(() => {
    loadAirports();
  }, [sortBy, sortOrder, filter, pagination.page, pagination.limit, loadAirports]);

  // Load statistics only on mount
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Handler for sorting - updates state and resets to page 1
  const handleSort = (field) => {
    const newOrder = field === sortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
    // Reset to page 1 when sorting changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handler for filter input change - updates state and resets to page 1
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    // Reset to first page whenever the filter changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // --- Form Visibility Handlers ---
  const handleAddAirport = () => {
    setShowForm(true);
    setShowDeleteForm(false);
  };

  const handleDeleteAirport = () => {
    setShowDeleteForm(true);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setShowDeleteForm(false);
  };

  // --- Handlers after form submission (Success) ---
  // Reload data after adding/deleting
  const handleAirportAdded = () => {
    setShowForm(false);
    setTimeout(loadAirports, 500); // Reload airport list
    setTimeout(loadStatistics, 500);
  };

  const handleAirportDeleted = () => {
    setShowDeleteForm(false);
    setTimeout(loadAirports, 500); // Reload airport list
    setTimeout(loadStatistics, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Airport Data Management</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {showForm ? (
          <AirportForm onCancel={handleFormCancel} onSuccess={handleAirportAdded} />
        ) : showDeleteForm ? (
          <DeleteAirportForm onCancel={handleFormCancel} onSuccess={handleAirportDeleted} />
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <input
                type="text"
                placeholder="Filter by airport name..."
                className="px-4 py-2 border rounded-md w-full sm:w-64" // Full width on small screens
                value={filter}
                onChange={handleFilterChange} // This triggers API reload via useEffect
              />
              <div className="flex gap-2 flex-shrink-0"> {/* Prevent buttons from shrinking */}
                <button
                  onClick={handleAddAirport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add New Airport
                </button>
                <button
                  onClick={handleDeleteAirport}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Airport
                </button>
              </div>
            </div>

            <AirportStatistics statistics={statistics} totalAirports={pagination.total} />

            <div className="mt-6"> {/* Added margin top */}
              <AirportTable
                airports={airports} // Pass the state directly (data is filtered by backend)
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort} // Pass the sort handler
                pagination={pagination}
                setPagination={setPagination} // Pass the pagination state setter
                filter={filter}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;