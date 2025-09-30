import math
from typing import List, Dict, Tuple, Optional

class RouteOptimizer:
    def __init__(self, locations: List[Dict], distance_matrix: Optional[List[List[float]]] = None, 
                 geometry_cache: Optional[Dict] = None):
        self.locations = [loc for loc in locations if loc.get('success', True)]
        self.distance_matrix = distance_matrix
        self.geometry_cache = geometry_cache or {}
        
        if self.distance_matrix is None:
            self._build_distance_matrix()
    
    def _build_distance_matrix(self):
        """Build distance matrix using haversine if no routing service provided."""
        n = len(self.locations)
        self.distance_matrix = [[0.0 for _ in range(n)] for _ in range(n)]
        
        for i in range(n):
            for j in range(n):
                if i != j:
                    self.distance_matrix[i][j] = self.calculate_distance(
                        self.locations[i], self.locations[j]
                    )
    
    def calculate_distance(self, loc1: Dict, loc2: Dict) -> float:
        """Calculate haversine distance between two locations."""
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
    
    def _get_distance(self, i: int, j: int) -> float:
        """Get distance between locations at index i and j."""
        return self.distance_matrix[i][j]
    
    def _calculate_route_distance(self, route_indices: List[int]) -> float:
        """Calculate total distance for a route given by location indices."""
        total = 0.0
        for i in range(len(route_indices) - 1):
            total += self._get_distance(route_indices[i], route_indices[i + 1])
        return total
    
    def _build_route_response(self, route_indices: List[int]) -> Dict:
        """Build the response with route order and geometries."""
        route = []
        total_distance = 0.0
        geometries = []
        
        for order, idx in enumerate(route_indices, start=1):
            route.append({
                **self.locations[idx],
                "order": order
            })
        
        for i in range(len(route_indices) - 1):
            idx1, idx2 = route_indices[i], route_indices[i + 1]
            total_distance += self._get_distance(idx1, idx2)
            
            if (idx1, idx2) in self.geometry_cache:
                geometries.append(self.geometry_cache[(idx1, idx2)])
            else:
                geometries.append([
                    [self.locations[idx1]['lat'], self.locations[idx1]['lng']],
                    [self.locations[idx2]['lat'], self.locations[idx2]['lng']]
                ])
        
        return {
            "route": route,
            "total_distance": round(total_distance, 2),
            "geometries": geometries
        }
    
    def nearest_neighbor(self) -> Dict:
        """Nearest neighbor algorithm (greedy approach)."""
        if not self.locations:
            return {"route": [], "total_distance": 0, "geometries": []}
        
        if len(self.locations) == 1:
            return {
                "route": [{**self.locations[0], "order": 1}],
                "total_distance": 0,
                "geometries": []
            }
        
        n = len(self.locations)
        unvisited = set(range(1, n))
        route_indices = [0]
        
        current_idx = 0
        
        while unvisited:
            nearest_idx = None
            nearest_distance = float('inf')
            
            for idx in unvisited:
                distance = self._get_distance(current_idx, idx)
                if distance < nearest_distance:
                    nearest_distance = distance
                    nearest_idx = idx
            
            route_indices.append(nearest_idx)
            unvisited.remove(nearest_idx)
            current_idx = nearest_idx
        
        return self._build_route_response(route_indices)
    
    def optimize(self, algorithm: str = "nearest_neighbor") -> Dict:
        return self.nearest_neighbor()