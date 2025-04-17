#!/usr/bin/env python3
import json
import os

def find_top_timezones(limit=10):
    # Load airport data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, '..', 'data', 'airports.json')
    
    with open(data_path, 'r') as f:
        airports_data = json.load(f)
    
    # Count timezones
    timezones = {}
    
    for icao, airport in airports_data.items():
        tz = airport.get('tz')
        if tz:
            timezones[tz] = timezones.get(tz, 0) + 1
    
    # Sort and limit
    sorted_timezones = sorted(timezones.items(), key=lambda x: x[1], reverse=True)
    top_timezones = sorted_timezones[:limit]
    
    # Print results
    print(f"Top {limit} timezones:")
    for tz, count in top_timezones:
        print(f"{tz}: {count} airports")
    
    return [{'timezone': tz, 'count': count} for tz, count in top_timezones]

if __name__ == "__main__":
    find_top_timezones()
