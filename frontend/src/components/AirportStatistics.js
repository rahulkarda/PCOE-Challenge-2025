import React from "react";

const AirportStatistics = ({ statistics, totalAirports }) => {
  const {
    averageElevation,
    noIataCount,
    noIataAirports,
    topTimezones,
    elevationPerCountry,
  } = statistics;

  // Calculate percentage of airports without IATA
  const noIataPercentage = totalAirports
    ? Math.round((noIataCount / totalAirports) * 100)
    : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Airport Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Average Elevation */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-sm font-medium text-gray-500">Average Elevation</h3>
          <p className="text-2xl font-bold">{averageElevation} ft</p>
        </div>

        {/* No IATA Codes */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-sm font-medium text-gray-500">Airports without IATA</h3>
          <p className="text-2xl font-bold">
            {noIataCount} ({noIataPercentage}%)
          </p>
          <div className="max-h-48 overflow-y-auto mt-2">
            <ul className="text-sm space-y-1">
              {noIataAirports &&
                noIataAirports.map((airport) => (
                  <li key={airport.icao}>{airport.name}</li>
                ))}
            </ul>
          </div>
        </div>

        {/* Top Timezones */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-sm font-medium text-gray-500">Top Timezones</h3>
          <ul className="mt-2 space-y-1">
            {topTimezones.map((tz) => (
              <li key={tz.timezone} className="flex justify-between">
                <span className="text-purple-600">{tz.timezone}</span>
                <span className="text-orange-500">{tz.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Average Elevation per Country */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-sm font-medium text-gray-500">Avg Elevation per Country</h3>
          <div className="max-h-48 overflow-y-auto mt-2">
            <ul className="text-sm space-y-1">
              {elevationPerCountry.map((country) => (
                <li key={country.country} className="flex justify-between">
                  <span className="text-blue-600">{country.country}</span>
                  <span className="text-green-500">{country.average} ft</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportStatistics;
