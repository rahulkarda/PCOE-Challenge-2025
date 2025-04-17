#!/usr/bin/env python3
import json
import os

def find_airports_without_iata():
    # Load airport data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, '..', 'data', 'airports.json')
    
    with open(data_path, 'r') as f:
        airports_data = json.load(f)
    
    # Find airports without IATA codes
    no_iata = []
    
    for icao, airport in airports_data.items():
        if not airport.get('iata') or airport.get('iata') == '':
            no_iata.append(airport)
    
    # Print results
    print(f"Found {len(no_iata)} airports without IATA codes:")
    for airport in no_iata:
        print(f"{airport['name']} ({airport['icao']})")
    
    return no_iata

if __name__ == "__main__":
    find_airports_without_iata()
