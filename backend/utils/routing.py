import requests
import time
from typing import List, Dict, Tuple, Optional

class RoutingService:
    def __init__(self):
        self.osrm_base_url = "http://router.project-osrm.org/route/v1/driving"
        self.delay = 0.5
    
    def get_route(self, loc1: Dict, loc2: Dict) -> Optional[Dict]:
        """
        Get route between two locations using OSRM API.
        Returns route geometry and distance in kilometers.
        """
        try:
            time.sleep(self.delay)
            
            coords = f"{loc1['lng']},{loc1['lat']};{loc2['lng']},{loc2['lat']}"
            url = f"{self.osrm_base_url}/{coords}"
            params = {
                'overview': 'full',
                'geometries': 'geojson',
                'steps': 'false'
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('code') == 'Ok' and data.get('routes'):
                    route = data['routes'][0]
                    distance_km = route['distance'] / 1000
                    geometry = route['geometry']['coordinates']
                    
                    return {
                        'distance': distance_km,
                        'geometry': [[coord[1], coord[0]] for coord in geometry],
                        'success': True
                    }
            
            return None
            
        except Exception as e:
            return None
    
    def get_route_matrix(self, locations: List[Dict]) -> Tuple[List[List[float]], Dict]:
        """
        Calculate distance matrix and store all route geometries.
        Returns (distance_matrix, geometry_cache).
        """
        n = len(locations)
        distance_matrix = [[0.0 for _ in range(n)] for _ in range(n)]
        geometry_cache = {}
        
        for i in range(n):
            for j in range(n):
                if i != j:
                    route = self.get_route(locations[i], locations[j])
                    if route and route['success']:
                        distance_matrix[i][j] = route['distance']
                        geometry_cache[(i, j)] = route['geometry']
                    else:
                        distance_matrix[i][j] = self._haversine_distance(locations[i], locations[j])
                        geometry_cache[(i, j)] = [
                            [locations[i]['lat'], locations[i]['lng']],
                            [locations[j]['lat'], locations[j]['lng']]
                        ]
        
        return distance_matrix, geometry_cache
    
    def _haversine_distance(self, loc1: Dict, loc2: Dict) -> float:
        """Fallback to straight-line distance if routing fails."""
        import math
        
        lat1, lng1 = loc1['lat'], loc1['lng']
        lat2, lng2 = loc2['lat'], loc2['lng']
        
        R = 6371
        
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
             math.sin(dlng / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
