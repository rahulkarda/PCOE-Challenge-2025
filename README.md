# Airport Data Management Application

A full-stack web application to manage and display airport data. The backend exposes multiple REST endpoints to interact with the dataset, and the frontend provides a clean, minimalistic user interface to consume and display the data.

## Deployment

This application is deployed on SAP Business Technology Platform (SAP BTP) using Cloud Foundry.

**Frontend:**
https://frontend-excellent-warthog-nq.cfapps.us10-001.hana.ondemand.com

**Backend:**
https://backend-impressive-okapi-wv.cfapps.us10-001.hana.ondemand.com

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Tailwind CSS
- **Data Storage**: In-memory (JSON)
- **Testing**: Jest (for backend)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

### Running the Backend

1. Navigate to the backend directory:
   `cd backend`

2. Install dependencies:
   `npm install`

3. Start the development server:
   `npm run dev`

The backend server will start on http://localhost:5050.

### Running the Frontend

1. Navigate to the frontend directory:
   `cd frontend`

2. Install dependencies:
   `npm install`

3. Start the development server:
   `npm start`

The frontend application will start on http://localhost:3000.


## Features

### Application Development Tasks Covered

1. **Load all airports from JSON or CSV via a REST endpoint**  
   - Implemented via `GET /airports`, which returns all airport data from in-memory JSON.

2. **Derived field `region` (e.g., "US-Wisconsin" from country and state)**  
   - Computed dynamically in backend by combining `country` and `state` fields during airport data load.

3. **Sort by name, city, state, or country (ascending/descending)**  
   - Enabled through `GET /airports?sortBy=field&order=asc|desc`.

4. **Filter airports by name using a "contains" filter**  
   - Available via `/airport?$filter=contains(name,'value')`.

5. **Add new airports dynamically at runtime via POST endpoint**  
   - Done through `POST /airports`, accepting airport data in request body.

6. **React-based UI with table showing the full airport dataset**  
   - UI fetches data from backend and renders in a scrollable, sortable, and filterable table using React and Tailwind CSS.

7. **Highlight rows where elevation is greater than 8000 feet**  
   - Handled in frontend by applying a highlight class based on the `elevation` field.

8. **Unit tests for backend using Jest**  
   - Test cases written in Jest for all major endpoints and functionalities. Run with `npm test`.

9. **Deployed to SAP BTP using Cloud Foundry**  
   - Both backend and frontend deployed to SAP BTP endpoints:
     - Backend: https://backend-impressive-okapi-wv.cfapps.us10-001.hana.ondemand.com  
     - Frontend: https://frontend-excellent-warthog-nq.cfapps.us10-001.hana.ondemand.com

### Scripting Tasks Covered

1. **Calculate average elevation per country**  
   - API: `GET /scripts/average-elevation-per-country`  
   - Aggregates and returns average elevation grouped by `country`.

2. **Find airports without IATA codes**  
   - API: `GET /scripts/no-iata`  
   - Filters and returns airports where the `iata` field is missing or empty.

3. **Determine the 10 most common time zones**  
   - API: `GET /scripts/top-timezones?limit=10`  
   - Returns top 10 time zones by number of airports.


## API Endpoints

### Airports

- **GET /airports** - Get all airports
  - Query Parameters:
    - `sortBy`: Sort by field (name, city, state, country, region, elevation, iata, icao, tz)
    - `order`: Sort order (asc, desc)
    - `filter`: Filter by airport name substring

- **GET /airport?$filter=contains(name,'value')** - Filter airports using contains syntax
  - Example: `/airport?$filter=contains(name,'Cordes')`

- **POST /airports** - Add a new airport
  - Required fields: name, country, icao

- **GET /airports/:icao** - Get a specific airport by ICAO code

- **DELETE /airports/:icao** - Delete a specific airport by ICAO code

### Scripts

- **GET /scripts/average-elevation** - Get average elevation of all airports
- **GET /scripts/average-elevation-per-country** - Get average elevation per country
- **GET /scripts/no-iata** - Get airports with no IATA code
- **GET /scripts/top-timezones** - Get top timezones by airport count
  - Query Parameters:
    - `limit`: Number of top timezones to return (default: 10)

## Testing

Run the backend tests:

1. `cd backend`  
2. `npm test`

## Sample API Requests

### Add a New Airport

```bash
curl -X POST "http://localhost:5050/airports" \
-H "Content-Type: application/json" \
-d '{
  "name": "New Airport",
  "city": "New City",
  "state": "New State",
  "country": "NC",
  "elevation": 1000,
  "iata": "NEW",
  "icao": "NEWW",
  "lat": 10,
  "lon": 10,
  "timezone": "UTC"
}'
```

### Get Airports with No IATA Code

```bash
curl -X GET "http://localhost:5050/scripts/no-iata"
```

### Get Average Elevation Per Country

```bash
curl -X GET "http://localhost:5050/scripts/average-elevation-per-country"
```

### Get Top 10 Timezones

```bash
curl -X GET "http://localhost:5050/scripts/top-timezones?limit=10"
```

### Filter Airports by Name

```bash
curl -X GET "http://localhost:5050/airport?$filter=contains(name,'Cordes')"
```

## Features

- View and manage airports via UI
- Sort airports by multiple fields (name, city, state, country, region, elevation, iata, icao, timezone)
- Filter airports by name
- Highlight airports above 8000 ft elevation
- Add new airports
- Delete airports by ICAO code
- Show statistics:
  - Average elevation
  - Airports without IATA codes (with list)
  - Top timezones
  - Elevation per country

## Python Scripts

The application includes Python scripts for data analysis tasks:

- `average_elevation.py`: Calculate the average elevation of all airports
- `average_elevation_per_country.py`: Calculate the average elevation per country
- `no_iata.py`: Find airports without IATA codes
- `top_timezones.py`: Determine the most common timezones

These scripts can be run independently to get data in the console.

**For running the scripts:**
1. `cd backend`  
2. `cd scripts`
3. `python script.py`


## Additional Notes

- Latitude and longitude are displayed in decimal degrees
- The table is scrollable to accommodate all 11 columns
- The Airports without IATA and Avg Elevation per Country is a scrollable list
- The application provides a clean, minimalistic user interface
