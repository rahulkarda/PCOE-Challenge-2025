import json
import os

def calculate_average_elevation():
    # Load airport data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, '..', 'data', 'airports.json')
    
    with open(data_path, 'r') as f:
        airports_data = json.load(f)
    
    # Calculate average elevation
    total_elevation = 0
    count = 0
    
    for icao, airport in airports_data.items():
        try:
            elevation = int(airport.get('elevation', 0))
            total_elevation += elevation
            count += 1
        except (ValueError, TypeError):
            # Skip invalid elevation values
            pass
    
    average = round(total_elevation / count) if count > 0 else 0
    
    print(f"Average Elevation: {average} ft")
    return average

if __name__ == "__main__":
    calculate_average_elevation()
