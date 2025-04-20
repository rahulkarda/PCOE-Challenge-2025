const express = require("express");
const cors = require("cors");
const fs = require("fs").promises; // Use promises API for async operations
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Load airport data
let airportsData = {};
const dataFilePath = path.join(__dirname, "data/airports.json");

const loadAirportData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    airportsData = JSON.parse(data);
  } catch (err) {
    console.error("Error loading airport data:", err);
    // Handle the error appropriately, maybe exit the process or use an empty object
  }
};

// Convert object to array for easier manipulation
const getAirportsArray = () => {
  return Object.keys(airportsData).map((key) => ({
    ...airportsData[key],
    id: key,
  }));
};

// Helper function to add region field
const addRegionField = (airport) => {
  if (airport.country && airport.state) {
    return {
      ...airport,
      region: `${airport.country}-${airport.state}`,
    };
  }
  return airport;
};

// Root endpoint
app.get("/", (req, res) => {
  res.send("Airport Data Management API is running");
});

//Get all airports
app.get("/airports", (req, res) => {
  const {
    page = 1,
    limit = 50,
    sortBy = "name",
    order = "asc",
    filter = "",
    paginated = "false",
  } = req.query;

  let allAirports = getAirportsArray(); // Get all airports

  // Add region field
  let airports = allAirports.map(addRegionField);

  // Filter by name (contains)
  if (filter) {
    airports = airports.filter((airport) =>
      airport.name?.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Sort
  airports.sort((a, b) => {
    const aVal = a[sortBy] || "";
    const bVal = b[sortBy] || "";

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      return order === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    }
  });

  // If pagination is enabled, slice the data
  if (paginated === "true") {
    const offset = (page - 1) * limit;
    const paginatedData = airports.slice(offset, offset + Number(limit));
    return res.json({
      total: airports.length,
      page: Number(page),
      limit: Number(limit),
      data: paginatedData,
    });
  }

  // Else, return full data
  res.json({
    total: airports.length,
    data: airports,
  });
});


// Get single airport with filter support
app.get("/airport", (req, res) => {
  const { $filter = "" } = req.query;

  let allAirports = getAirportsArray(); // Get all airports

  // Add region field
  let airports = allAirports.map(addRegionField);

  // Handle custom $filter query if provided
  if ($filter) {
    // Example: $filter=contains(name,'Cordes')
    const filterParts = $filter.match(/contains\((\w+),'([^']+)'\)/); // Extract field and value from the contains function

    if (filterParts) {
      const [, field, value] = filterParts;
      // Apply filter to the specified field
      airports = airports.filter((airport) =>
        airport[field] && airport[field].toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  // If no filter is applied, return all airports
  res.json({
    data: airports,
  });
});


// GET airport by ICAO
app.get("/airports/:icao", (req, res) => {
  const { icao } = req.params;

  if (airportsData[icao]) {
    res.json(addRegionField(airportsData[icao]));
  } else {
    res.status(404).json({ error: "Airport not found" });
  }
});

// POST new airport
app.post("/airports", async (req, res) => {
  const { name, country, icao, city, state, elevation, iata, lat, lon, tz } = req.body;

  // Validate required fields
  if (!name || !country || !icao) {
    return res.status(400).json({ error: "Name, country, and ICAO code are required" });
  }

  // Check if ICAO already exists
  if (airportsData[icao]) {
    return res.status(400).json({ error: "Airport with this ICAO code already exists" });
  }

  // Create new airport
  const newAirport = {
    icao,
    iata: iata || "",
    name,
    city: city || "",
    state: state || "",
    country,
    elevation: elevation ? Number.parseInt(elevation, 10) : 0,
    lat: lat ? Number.parseFloat(lat) : 0,
    lon: lon ? Number.parseFloat(lon) : 0,
    tz: tz || "",
  };

  // Add to data
  airportsData[icao] = newAirport;

  // Save to file
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(airportsData, null, 2));
    res.status(201).json(addRegionField(newAirport));
    console.log("Airport data loaded successfully:", Object.keys(airportsData).length, "airports found."); // Add this log
  } catch (err) {
    console.error("Error saving airport data:", err);
    res.status(500).json({ error: "Failed to save airport data" });
  }
});

// DELETE airport
app.delete("/airports/:icao", async (req, res) => {
  const { icao } = req.params;

  if (!airportsData[icao]) {
    return res.status(404).json({ error: "Airport not found" });
  }

  // Delete airport
  const deletedAirport = airportsData[icao];
  delete airportsData[icao];

  // Save to file
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(airportsData, null, 2));
    res.json({ message: "Airport deleted successfully", airport: deletedAirport });
  } catch (err) {
    console.error("Error saving airport data:", err);
    res.status(500).json({ error: "Failed to delete airport" });
  }
});

// GET average elevation
app.get("/scripts/average-elevation", (req, res) => {
  const airports = getAirportsArray();

  if (airports.length === 0) {
    return res.json({ average: 0 });
  }

  const validElevations = airports
    .map((airport) => Number.parseInt(airport.elevation || 0, 10))
    .filter((elevation) => !isNaN(elevation));

  if (validElevations.length === 0) {
    return res.json({ average: 0 });
  }

  const sum = validElevations.reduce((acc, elevation) => acc + elevation, 0);
  const average = Math.round(sum / validElevations.length);

  res.json({ average });
});

// GET average elevation per country
app.get("/scripts/average-elevation-per-country", (req, res) => {
  const airports = getAirportsArray();
  const countries = {};

  airports.forEach((airport) => {
    if (!countries[airport.country]) {
      countries[airport.country] = {
        sum: 0,
        count: 0,
      };
    }

    const elevation = Number.parseInt(airport.elevation || 0, 10);
    if (!isNaN(elevation)) {
      countries[airport.country].sum += elevation;
      countries[airport.country].count += 1;
    }
  });

  const result = Object.keys(countries).map((country) => ({
    country,
    average: Math.round((countries[country].sum / countries[country].count) * 100) / 100,
  }));

  res.json(result);
});

// GET airports with no IATA code
app.get("/scripts/no-iata", (req, res) => {
  const airports = getAirportsArray();
  const noIata = airports.filter((airport) => !airport.iata || airport.iata === "");

  res.json(noIata);
});

// GET top timezones
app.get("/scripts/top-timezones", (req, res) => {
  const { limit = 10 } = req.query;
  const airports = getAirportsArray();
  const timezones = {};

  airports.forEach((airport) => {
    if (airport.tz) {
      timezones[airport.tz] = (timezones[airport.tz] || 0) + 1;
    }
  });

  const result = Object.keys(timezones)
    .map((tz) => ({ timezone: tz, count: timezones[tz] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, Number.parseInt(limit));

  res.json(result);
});

// Start the server after loading the data
loadAirportData().then(() => {
  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});

module.exports = app;