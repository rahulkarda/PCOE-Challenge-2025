import axios from "axios";

// Ensure this points to your running backend URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";

export const fetchAirports = async (sortBy = "name", order = "asc", filter = "", page = 1, limit = 50) => {
  try {
    const response = await axios.get(`${API_URL}/airports`, {
      params: { paginated: true, sortBy, order, filter, page, limit },
    });

    const { data, total, page: responsePage, limit: responseLimit } = response.data;

    return {
      airports: data || [], // Ensure airports is always an array
      total: total || 0,
      page: responsePage || page,
      limit: responseLimit || limit,
    };
  } catch (error) {
    console.error("Error fetching airports:", error);
    // Return empty state on error to prevent crashes
    return { airports: [], total: 0, page: 1, limit };
    // Or re-throw the error if App.js handles it explicitly
    // throw error;
  }
};

export const fetchAirport = async (icao) => {
  try {
    const response = await axios.get(`${API_URL}/airports/${icao}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching airport ${icao}:`, error);
    throw error;
  }
};

export const addAirport = async (airportData) => {
  try {
    const response = await axios.post(`${API_URL}/airports`, airportData);
    return response.data;
  } catch (error) {
    console.error("Error adding airport:", error);
    throw error; // Re-throw to be handled by the form component
  }
};

export const deleteAirport = async (icao) => {
  try {
    const response = await axios.delete(`${API_URL}/airports/${icao}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting airport ${icao}:`, error);
    throw error; // Re-throw to be handled by the form component
  }
};

export const fetchStatistics = async () => {
  try {
    const [averageElevation, noIata, topTimezones, elevationPerCountry] = await Promise.all([
      axios.get(`${API_URL}/scripts/average-elevation`),
      axios.get(`${API_URL}/scripts/no-iata`),
      axios.get(`${API_URL}/scripts/top-timezones?limit=10`),
      axios.get(`${API_URL}/scripts/average-elevation-per-country`),
    ]);

    return {
      averageElevation: averageElevation.data.average || 0,
      noIataCount: noIata.data?.length || 0, // Add safe access
      noIataAirports: noIata.data || [],
      topTimezones: topTimezones.data || [],
      elevationPerCountry: elevationPerCountry.data || [],
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Return default structure on error
    return {
        averageElevation: 0,
        noIataCount: 0,
        noIataAirports: [],
        topTimezones: [],
        elevationPerCountry: [],
    };
  }
};