const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
 
// Mock data
let mockAirports = [
  {
    name: "Atlanta Airport",
    country: "USA",
    icao: "KATL",
    city: "Atlanta",
    state: "Georgia",
    elevation: 313,
    iata: "ATL",
    lat: 33.6367,
    lon: -84.4281,
    tz: "America/New_York"
  },
  {
    name: "Test Airport",
    country: "Test Country",
    icao: "TEST",
    city: "Test City",
    state: "Test State",
    elevation: 100,
    iata: "TST",
    lat: 10.123,
    lon: 20.456,
    tz: "Test/Timezone"
  },
];
 
// Routes
app.get("/", (req, res) => {
  res.status(200).send("Airport Data Management API is running");
});
 
app.get("/airports", (req, res) => {
  const { page = 1, limit = 10, sortBy = "name", order = "asc", filter = "" } = req.query;
  let filtered = mockAirports.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()));
  filtered.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
    return 0;
  });
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + +limit);
  res.status(200).json({ total: filtered.length, page: +page, limit: +limit, data });
});
 
app.get("/airports/:icao", (req, res) => {
  const airport = mockAirports.find(a => a.icao === req.params.icao);
  if (airport) res.status(200).json(airport);
  else res.status(404).json({ error: "Airport not found" });
});
 
app.post("/airports", (req, res) => {
  const { name, country, icao } = req.body;
  if (!name || !country || !icao) {
    return res.status(400).json({ error: "Name, country, and ICAO code are required" });
  }
  mockAirports.push(req.body);
  res.status(201).json(req.body);
});
 
app.delete("/airports/:icao", (req, res) => {
  const index = mockAirports.findIndex(a => a.icao === req.params.icao);
  if (index !== -1) {
    mockAirports.splice(index, 1);
    res.status(200).json({ message: "Airport deleted successfully" });
  } else {
    res.status(404).json({ error: "Airport not found" });
  }
});
 
app.get("/scripts/average-elevation", (req, res) => {
  const total = mockAirports.reduce((acc, a) => acc + a.elevation, 0);
  const avg = mockAirports.length ? total / mockAirports.length : 0;
  res.status(200).json({ average: avg });
});
 
app.get("/scripts/average-elevation-per-country", (req, res) => {
  const grouped = {};
  mockAirports.forEach(({ country, elevation }) => {
    if (!grouped[country]) grouped[country] = [];
    grouped[country].push(elevation);
  });
  const result = Object.entries(grouped).map(([country, elevations]) => ({
    country,
    average: elevations.reduce((a, b) => a + b, 0) / elevations.length,
  }));
  res.status(200).json(result);
});
 
app.get("/scripts/no-iata", (req, res) => {
  const data = mockAirports.filter(a => !a.iata || a.iata === "");
  res.status(200).json(data);
});
 
app.get("/scripts/top-timezones", (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const countMap = {};
  mockAirports.forEach(({ tz }) => {
    countMap[tz] = (countMap[tz] || 0) + 1;
  });
  const result = Object.entries(countMap)
    .map(([timezone, count]) => ({ timezone, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  res.status(200).json(result);
});
 
// Tests
describe("Airport Data Management API (Mocked)", () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockAirports = [
      {
        name: "Atlanta Airport",
        country: "USA",
        icao: "KATL",
        city: "Atlanta",
        state: "Georgia",
        elevation: 313,
        iata: "ATL",
        lat: 33.6367,
        lon: -84.4281,
        tz: "America/New_York"
      }
    ];
  });
 
  test("GET / should return API running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Airport Data Management API is running");
  });
 
  test("GET /airports should return paginated, sorted, and filtered airports", async () => {
    const res = await request(app).get("/airports?page=1&limit=2&sortBy=name&order=asc&filter=atlanta");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });
 
  test("GET /airports/:icao should return airport details if ICAO exists", async () => {
    const res = await request(app).get("/airports/KATL");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("icao", "KATL");
  });
 
  test("GET /airports/:icao should return 404 if ICAO does not exist", async () => {
    const res = await request(app).get("/airports/INVALID");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Airport not found");
  });
 
  test("POST /airports should add a new airport", async () => {
    const newAirport = {
      name: "Test Airport",
      country: "Test Country",
      icao: "TEST",
      city: "Test City",
      state: "Test State",
      elevation: 100,
      iata: "TST",
      lat: 10.123,
      lon: 20.456,
      tz: "Test/Timezone",
    };
    const res = await request(app).post("/airports").send(newAirport);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("icao", "TEST");
  });
 
  test("POST /airports should return 400 if required fields are missing", async () => {
    const invalidAirport = {
      country: "Test Country",
      icao: "TEST",
    };
    const res = await request(app).post("/airports").send(invalidAirport);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Name, country, and ICAO code are required");
  });
 
  test("DELETE /airports/:icao should delete an airport if ICAO exists", async () => {
    const res = await request(app).delete("/airports/KATL");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Airport deleted successfully");
  });
 
  test("DELETE /airports/:icao should return 404 if ICAO does not exist", async () => {
    const res = await request(app).delete("/airports/INVALID");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Airport not found");
  });
 
  test("GET /scripts/average-elevation should return average elevation", async () => {
    const res = await request(app).get("/scripts/average-elevation");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("average");
    expect(typeof res.body.average).toBe("number");
  });
 
  test("GET /scripts/average-elevation-per-country should return average elevation per country", async () => {
    const res = await request(app).get("/scripts/average-elevation-per-country");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("country");
      expect(res.body[0]).toHaveProperty("average");
    }
  });
 
  test("GET /scripts/no-iata should return airports with no IATA code", async () => {
    const res = await request(app).get("/scripts/no-iata");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
 
  test("GET /scripts/top-timezones should return top timezones", async () => {
    const res = await request(app).get("/scripts/top-timezones?limit=5");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("timezone");
      expect(res.body[0]).toHaveProperty("count");
    }
  });
});