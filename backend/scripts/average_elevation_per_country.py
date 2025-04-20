import json
import os

def calculate_average_elevation_per_country():
    # Load airport data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, '..', 'data', 'airports.json')
    
    with open(data_path, 'r') as f:
        airports_data = json.load(f)
    
    # Calculate average elevation per country
    countries = {}
    
    for icao, airport in airports_data.items():
        country = airport.get('country')
        if not country:
            continue
            
        try:
            elevation = int(airport.get('elevation', 0))
            
            if country not in countries:
                countries[country] = {'sum': 0, 'count': 0}
            
            countries[country]['sum'] += elevation
            countries[country]['count'] += 1
        except (ValueError, TypeError):
            # Skip invalid elevation values
            pass
    
    # Calculate averages
    result = []
    for country, data in countries.items():
        average = round(data['sum'] / data['count'], 2) if data['count'] > 0 else 0
        result.append({
            'country': country,
            'average': average
        })
    
    # Print results
    for item in result:
        print(f"{item['country']}: {item['average']} ft")
    
    return result

if __name__ == "__main__":
    calculate_average_elevation_per_country()
